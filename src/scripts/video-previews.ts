/** One policy for hero, cards and gallery previews. Full players keep explicit controls. */
export function initVideoPreviews() {
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (
    navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean };
    }
  ).connection;
  const rows = [...document.querySelectorAll<HTMLElement>('[data-video-preview]')].map((root) => ({
    root,
    video: root.querySelector<HTMLVideoElement>('video')!,
    trigger: root.closest<HTMLElement>('[data-preview-trigger]') ?? root,
    hovered: false,
    focused: false,
    intent: 0,
    version: 0,
  }));
  type Row = (typeof rows)[number];
  let active: Row | undefined;
  let intent = 0;
  let frame = 0;
  let suspended = false;

  function stop(row: Row, release = false) {
    row.version++;
    row.video.pause();
    row.root.classList.remove('is-playing');
    row.video.classList.remove('is-playing');
    try {
      row.video.currentTime = 0;
    } catch {
      /* Unloaded media keeps the poster. */
    }
    if (release) {
      const source = row.video.querySelector('source');
      if (source?.hasAttribute('src')) {
        source.removeAttribute('src');
        row.video.preload = 'none';
        row.video.load();
      }
    }
  }

  function refresh() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    const allowed =
      !suspended &&
      !document.hidden &&
      !reduced.matches &&
      !connection?.saveData &&
      !document.querySelector('dialog[open]');
    const candidates = rows.flatMap((row) => {
      const box = row.root.getBoundingClientRect();
      const visible =
        box.height > 0 &&
        box.width > 0 &&
        box.bottom > 0 &&
        box.top < innerHeight &&
        box.right > 0 &&
        box.left < innerWidth;
      if (!visible) {
        row.hovered = false;
        row.focused = false;
        if (row !== active) stop(row, true);
      }
      if (!allowed || !visible) return [];
      if (pointer.matches) return row.hovered || row.focused ? [{ row, score: -row.intent }] : [];
      const visibleHeight = Math.min(box.bottom, innerHeight) - Math.max(box.top, 0);
      const inCentre = box.bottom > innerHeight * 0.35 && box.top < innerHeight * 0.65;
      return inCentre && visibleHeight >= Math.min(box.height, innerHeight) * 0.3
        ? [{ row, score: Math.abs((box.top + box.bottom) / 2 - innerHeight / 2) }]
        : [];
    });
    const next = candidates.sort((a, b) => a.score - b.score)[0]?.row;
    if (next === active) return;
    if (active) stop(active, !active.root.getClientRects().length);
    active = next;
    if (!next) return;
    const { video } = next;
    const source = video.querySelector<HTMLSourceElement>('source[data-src]');
    if (source && !source.hasAttribute('src')) {
      source.src = source.dataset.src!;
      video.load();
    }
    video.preload = 'metadata';
    const version = ++next.version;
    video
      .play()
      .then(() => {
        if (active === next && version === next.version && !document.hidden && !suspended) {
          next.root.classList.add('is-playing');
          video.classList.add('is-playing');
        } else if (active !== next) video.pause();
      })
      .catch(() => {
        /* Blocked autoplay leaves the first-frame image visible. */
      });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(refresh);
  }
  for (const row of rows) {
    row.trigger.addEventListener('pointerenter', () => {
      row.hovered = true;
      row.intent = ++intent;
      refresh();
    });
    row.trigger.addEventListener('pointerleave', () => {
      row.hovered = false;
      refresh();
    });
    row.trigger.addEventListener('focusin', () => {
      row.focused = true;
      row.intent = ++intent;
      refresh();
    });
    row.trigger.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && row.trigger.contains(event.relatedTarget)) return;
      row.focused = false;
      refresh();
    });
  }
  const visibility = new IntersectionObserver(schedule, { threshold: [0, 0.3, 0.65, 1] });
  const size = new ResizeObserver(schedule);
  rows.forEach(({ root }) => {
    visibility.observe(root);
    size.observe(root);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', refresh);
  document.addEventListener('oda:media-viewer-change', refresh);
  window.addEventListener('pagehide', () => {
    suspended = true;
    refresh();
  });
  window.addEventListener('pageshow', () => {
    suspended = false;
    refresh();
  });
  pointer.addEventListener('change', () => {
    rows.forEach((row) => {
      row.hovered = false;
      row.focused = row.trigger.contains(document.activeElement);
    });
    refresh();
  });
  reduced.addEventListener('change', refresh);
  connection?.addEventListener('change', refresh);
  schedule();
  return { refresh };
}
