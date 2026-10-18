import { mediaFitScale, mediaZoomPosition } from '../lib/media-viewport';
import { linkDestination, linkTargetFamily } from '../lib/link-destination';
import { technicalPaths } from '../lib/technical-marks';

/** One controller for every image/video trigger; only the stage zooms, never the controls. */
export function initMediaViewer() {
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
  if (!dialog) return;
  const image = dialog.querySelector<HTMLImageElement>('img')!;
  const canvas = dialog.querySelector<HTMLElement>('.lightbox-canvas')!;
  const video = dialog.querySelector<HTMLVideoElement>('video')!;
  const caption = dialog.querySelector<HTMLElement>('.lightbox-caption')!;
  const details = dialog.querySelector<HTMLElement>('[data-viewer-details]')!;
  const detailsLink = details.querySelector<HTMLAnchorElement>('a')!;
  const position = dialog.querySelector<HTMLElement>('.lightbox-position')!;
  const status = dialog.querySelector<HTMLElement>('.lightbox-status')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('[data-viewer-zoom]')!;
  const stage = dialog.querySelector<HTMLElement>('.lightbox-stage')!;
  const previous = dialog.querySelector<HTMLButtonElement>('[data-viewer-previous]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-viewer-next]')!;
  const ru = document.documentElement.lang === 'ru';
  let trigger: HTMLButtonElement | undefined;
  let items: HTMLButtonElement[] = [];
  let index = 0;
  let scale = 1;
  let fitted = true;
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch: { distance: number; x: number; y: number } | undefined;
  const notify = () => document.dispatchEvent(new Event('oda:media-viewer-change'));
  const fitScale = () =>
    mediaFitScale(
      image.naturalWidth,
      image.naturalHeight,
      stage.getBoundingClientRect().width,
      stage.getBoundingClientRect().height,
    );

  function render() {
    if (!dialog!.open || image.hidden || !image.naturalWidth) return;
    if (fitted) scale = fitScale();
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    // Content geometry derives solely from the original and available viewport.
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    dialog!.toggleAttribute('data-zoomed', !fitted);
    zoom.setAttribute('aria-pressed', String(!fitted));
    zoom.title = fitted
      ? ru
        ? 'Оригинальный размер'
        : 'Original size'
      : ru
        ? 'Вписать в экран'
        : 'Fit to screen';
    stage.tabIndex = fitted ? -1 : 0;
  }
  function resetZoom() {
    fitted = true;
    pointers.clear();
    pinch = undefined;
    dialog!.removeAttribute('data-panning');
    dialog!.removeAttribute('data-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    stage.tabIndex = -1;
    render();
    stage.scrollTo(0, 0);
  }
  function changeScale(
    nextScale: number,
    x = stage.getBoundingClientRect().width / 2,
    y = stage.getBoundingClientRect().height / 2,
    previousX = x,
    previousY = y,
  ) {
    if (!image.naturalWidth) return;
    const minimum = fitScale();
    const limit = Number.parseFloat(getComputedStyle(dialog!).getPropertyValue('--lightbox-zoom-limit'));
    const nextValue = Math.max(minimum, Math.min(Math.max(1, minimum * limit), nextScale));
    const old = {
      scale,
      width: stage.clientWidth,
      height: stage.clientHeight,
      left: stage.scrollLeft,
      top: stage.scrollTop,
    };
    scale = nextValue;
    fitted = Math.abs(scale - minimum) < 0.000001;
    render();
    const scroll = mediaZoomPosition({
      width: image.naturalWidth,
      height: image.naturalHeight,
      viewportWidth: stage.clientWidth,
      viewportHeight: stage.clientHeight,
      previousViewportWidth: old.width,
      previousViewportHeight: old.height,
      scale: old.scale,
      nextScale: nextValue,
      left: old.left,
      top: old.top,
      anchorX: x,
      anchorY: y,
      previousX,
      previousY,
    });
    stage.scrollTo(scroll.left, scroll.top);
  }
  function unload() {
    resetZoom();
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('data-media-id');
    video.removeAttribute('poster');
    video.load();
    image.removeAttribute('src');
    status.textContent = '';
    status.hidden = true;
    details.hidden = true;
    detailsLink.removeAttribute('href');
  }
  function show(offset = 0) {
    index = (index + offset + items.length) % items.length;
    const item = items[index];
    unload();
    const moving = item.dataset.kind === 'video';
    zoom.hidden = moving;
    canvas.hidden = moving;
    image.hidden = moving;
    video.hidden = !moving;
    const mediaId = item.closest<HTMLElement>('[data-media-id]')?.dataset.mediaId;
    if (moving) {
      video.src = item.dataset.src ?? '';
      video.poster = item.dataset.poster ?? '';
      video.setAttribute('aria-label', item.dataset.alt ?? '');
      if (mediaId) video.dataset.mediaId = mediaId;
    } else {
      image.alt = item.dataset.alt ?? '';
      image.src = item.dataset.src ?? '';
    }
    const fullCaption = [item.dataset.caption, item.dataset.credit].filter(Boolean).join(' · ');
    caption.textContent = item.dataset.viewerSummary ?? fullCaption;
    caption.title = fullCaption;
    caption.setAttribute('aria-label', fullCaption);
    details.hidden = !item.dataset.detailsHref;
    if (item.dataset.detailsHref) {
      detailsLink.href = item.dataset.detailsHref;
      const canonical =
        document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? location.origin;
      const destination = linkDestination(detailsLink.href, location.href, canonical);
      detailsLink.dataset.linkDestination = destination;
      if (['internal', 'section'].includes(destination))
        detailsLink.dataset.linkFamily = linkTargetFamily(detailsLink.href, location.href);
      else delete detailsLink.dataset.linkFamily;
      const kind = destination === 'external' ? 'linkCircle' : 'linkPlain';
      const mark = detailsLink.querySelector<SVGElement>('.technical-mark');
      if (mark) {
        mark.dataset.mark = kind;
        mark.querySelector('path')?.setAttribute('d', technicalPaths[kind]);
      }
    }
    position.textContent = `${index + 1} / ${items.length}`;
    position.hidden = items.length < 2;
    previous.hidden = next.hidden = items.length < 2;
    render();
    notify();
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-lightbox]')) {
    button.addEventListener('click', () => {
      trigger = button;
      const gallery = button.hasAttribute('data-gallery-item')
        ? button.closest('[data-media-gallery]')
        : null;
      items = gallery ? [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-item]')] : [button];
      index = items.indexOf(button);
      // Inline playback must not continue behind its full-screen counterpart.
      button
        .closest('figure')
        ?.querySelectorAll('video')
        .forEach((player) => player.pause());
      show();
      document.documentElement.classList.add('has-media-viewer');
      dialog.showModal();
      render();
      notify();
    });
  }
  zoom.addEventListener('click', () => {
    if (fitted) {
      changeScale(1);
      if (!fitted) stage.focus();
    } else {
      resetZoom();
      zoom.focus();
    }
  });
  detailsLink.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => show(-1));
  next.addEventListener('click', () => show(1));
  image.addEventListener('load', () => {
    resetZoom();
    render();
  });
  new ResizeObserver(() => {
    render();
    if (fitted) stage.scrollTo(0, 0);
  }).observe(stage);

  function pinchState() {
    const [a, b] = [...pointers.values()];
    const rect = stage.getBoundingClientRect();
    return {
      distance: Math.hypot(b.x - a.x, b.y - a.y),
      x: (a.x + b.x) / 2 - rect.left,
      y: (a.y + b.y) / 2 - rect.top,
    };
  }
  stage.addEventListener('pointerdown', (event) => {
    if (image.hidden || (event.pointerType !== 'touch' && (fitted || event.button !== 0))) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId);
    if (pointers.size === 2) pinch = pinchState();
    if (!fitted) dialog!.setAttribute('data-panning', '');
  });
  stage.addEventListener('pointermove', (event) => {
    const last = pointers.get(event.pointerId);
    if (!last) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const current = pinchState();
      if (pinch && pinch.distance > 0)
        changeScale((scale * current.distance) / pinch.distance, current.x, current.y, pinch.x, pinch.y);
      pinch = current;
      event.preventDefault();
    } else if (!fitted) {
      stage.scrollBy(last.x - event.clientX, last.y - event.clientY);
      event.preventDefault();
    }
  });
  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    pinch = pointers.size >= 2 ? pinchState() : undefined;
    if (!pointers.size) dialog!.removeAttribute('data-panning');
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  dialog.addEventListener('keydown', (event) => {
    if (event.target === video || (event.target === stage && !fitted) || items.length < 2) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.querySelector<HTMLButtonElement>('.lightbox-close')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    unload();
    document.documentElement.classList.remove('has-media-viewer');
    trigger?.focus();
    notify();
  });
  const error = () => {
    if (!dialog.open) return;
    status.textContent = ru
      ? 'Материал недоступен. Выберите другой или закройте просмотр.'
      : 'Media unavailable. Choose another item or close the viewer.';
    status.hidden = false;
  };
  image.addEventListener('error', error);
  video.addEventListener('error', error);
}
