/** Persistent chapter navigation; ordinary anchors and native details remain usable without JS. */
export function initReadingNavigation() {
  const navigation = document.querySelector<HTMLElement>('[data-reading-navigation]');
  const details = navigation?.querySelector<HTMLDetailsElement>('details');
  if (!navigation || !details) return;
  const ru = document.documentElement.lang === 'ru';
  const label = navigation.querySelector<HTMLElement>('[data-reading-label]')!;
  const outlineLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-outline-target]')];
  const chapters = [...navigation.querySelectorAll<HTMLAnchorElement>('.reading-outline a')]
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((node): node is HTMLElement => Boolean(node));
  const targets =
    document.documentElement.dataset.pageKind === 'cases'
      ? [...document.querySelectorAll<HTMLElement>('main [data-page-chapter], main .case-row[id]')]
      : chapters;
  let frame = 0;
  let current = -2;
  function update() {
    frame = 0;
    const edge =
      Math.max(
        document.querySelector('.site-header')!.getBoundingClientRect().bottom + 1,
        parseFloat(getComputedStyle(chapters[0]).scrollMarginTop) || 0,
      ) + 2;
    const indexAtEdge = (nodes: HTMLElement[]) => {
      let index = -1;
      nodes.forEach((node, i) => {
        if (node.getClientRects().length && node.getBoundingClientRect().top <= edge) index = i;
      });
      return index;
    };
    const atEnd = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    const chapter = atEnd
      ? chapters.findLastIndex((node) => node.getClientRects().length > 0)
      : indexAtEdge(chapters);
    const index = atEnd
      ? targets.findLastIndex((node) => node.getClientRects().length > 0)
      : indexAtEdge(targets);
    outlineLinks.forEach((link) => {
      if (chapter >= 0 && link.hash === '#' + chapters[chapter].id)
        link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (index === current) return;
    current = index;
    const target = targets[index];
    const heading = target?.querySelector('h2, h3')?.textContent?.trim() || '';
    const year = target?.dataset.caseYear;
    label.textContent =
      index < 0 ? (ru ? 'Содержание' : 'Contents') : year ? `${year} · ${heading}` : heading;
    label.title = label.textContent;
    const codeSlot = navigation?.querySelector('[data-reading-code]');
    const activeCode =
      chapter >= 0
        ? outlineLinks.find((link) => link.hash === '#' + chapters[chapter].id)?.querySelector('.page-code')
        : undefined;
    if (codeSlot && activeCode) codeSlot.replaceChildren(activeCode.cloneNode(true));
    else if (codeSlot) codeSlot.replaceChildren();
    navigation?.querySelectorAll<HTMLAnchorElement>('[data-reading-year]').forEach((link) => {
      if (year && link.dataset.readingYear === year) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('hashchange', schedule);
  addEventListener('pageshow', schedule);
  document.addEventListener('oda:cases:filtered', schedule);
  const main = document.querySelector('main');
  if (main) new ResizeObserver(schedule).observe(main);
  const initialHash = location.hash;
  let interruptedAnchor = false;
  const interruptAnchor = () => {
    interruptedAnchor = true;
  };
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown'])
    addEventListener(event, interruptAnchor, { once: true, passive: true });
  void document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      // Font loading can change the height above a browser's initial fragment scroll.
      if (initialHash && location.hash === initialHash && !interruptedAnchor)
        document.getElementById(initialHash.slice(1))?.scrollIntoView();
      schedule();
    });
  });
  details.addEventListener('toggle', () => {
    if (details.open) document.dispatchEvent(new CustomEvent('oda:contents:open'));
  });
  document.addEventListener('oda:main-menu:open', () => {
    details.open = false;
  });
  document.addEventListener('oda:workspace:open', () => {
    details.open = false;
  });
  document.addEventListener('focusin', (event) => {
    if (event.target instanceof Node && !details.contains(event.target)) details.open = false;
  });
  details.querySelector('summary')?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    details.open = true;
    details.querySelector<HTMLAnchorElement>('.reading-contents-panel a')?.focus();
  });
  document.addEventListener('click', (event) => {
    const element = event.target;
    if (!(element instanceof Element)) return;
    const link = element.closest<HTMLAnchorElement>('.reading-contents-panel a[href^="#"]');
    if (link) {
      details.open = false;
      const destination = document.getElementById(link.hash.slice(1));
      const heading =
        link.hash === '#top'
          ? document.querySelector<HTMLElement>('main h1')
          : destination?.querySelector<HTMLElement>('h2, h3');
      if (heading) {
        heading.tabIndex = -1;
        requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      }
    } else if (!details.contains(element)) details.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      details.querySelector('summary')?.focus();
    }
  });
  schedule();
}
