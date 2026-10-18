// CAD leader links: the final shelf and diagonal share one SVG path and join.
// Opt in anywhere with data-callout-link; established editorial links use it by default.
(() => {
  const selector = '[data-callout-link]';
  const namespace = 'http://www.w3.org/2000/svg';
  const links = new Set();
  let frame;

  function mount(link) {
    if (link.querySelector(':scope > .callout-link-content')) return;
    const text = link.textContent
      .replace(/\s*[↗→]\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return;
    const content = document.createElement('span');
    content.className = 'callout-link-content';
    const tail = document.createElement('span');
    tail.className = 'callout-link-tail';
    const split = text.lastIndexOf(' ');
    content.append(document.createTextNode(split < 0 ? '' : text.slice(0, split + 1)));
    tail.append(document.createTextNode(text.slice(split + 1) + '\u00a0'));
    const marker = document.createElement('span');
    marker.className = 'callout-link-marker';
    marker.setAttribute('aria-hidden', 'true');
    const destinationMark = link.querySelector('template[data-link-mark]')?.content.firstElementChild;
    if (destinationMark) marker.append(destinationMark.cloneNode(true));
    tail.append(marker);
    content.append(tail);
    const svg = document.createElementNS(namespace, 'svg');
    svg.classList.add('callout-link-drawing');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.append(document.createElementNS(namespace, 'path'));
    content.append(svg);
    link.replaceChildren(content);
    link.classList.add('callout-link');
  }

  function draw(link) {
    mount(link); // Language switching may replace the anchor's textContent.
    const content = link.querySelector('.callout-link-content');
    if (!content || !content.getClientRects().length) return;
    const marker = content.querySelector('.callout-link-marker');
    const svg = content.querySelector('.callout-link-drawing');
    const origin = svg.getBoundingClientRect();
    const end = marker.getBoundingClientRect();
    const range = document.createRange();
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const rows = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent) continue;
      range.selectNodeContents(walker.currentNode);
      for (const rect of range.getClientRects()) {
        if (!rect.width) continue;
        let row = rows.find((item) => Math.abs(item.bottom - rect.bottom) < 1);
        if (!row) rows.push((row = { left: rect.left, right: rect.right, bottom: rect.bottom }));
        row.left = Math.min(row.left, rect.left);
        row.right = Math.max(row.right, rect.right);
      }
    }
    rows.sort((a, b) => a.bottom - b.bottom);
    if (!rows.length) return;
    // An inline-block's bottom is the real text baseline. Offset clears descenders.
    const baselineDelta = end.bottom - rows[rows.length - 1].bottom;
    const offset = end.height;
    const size = end.width;
    const head = parseFloat(getComputedStyle(marker).paddingLeft);
    const coordinate = (value) => Number(value.toFixed(3));
    const point = (x, y) => `${coordinate(x - origin.left)} ${coordinate(y - origin.top)}`;
    const segments = rows.map((row, index) => {
      const y = row.bottom + baselineDelta + offset;
      if (link.dataset.linkDestination) {
        // TechnicalMark starts at (0,24), joining the shelf at its elbow.
        const right = index === rows.length - 1 ? end.left : row.right;
        return `M${point(row.left, y)} H${coordinate(right - origin.left)}`;
      }
      if (index !== rows.length - 1) return `M${point(row.left, y)} H${coordinate(row.right - origin.left)}`;
      const x = end.left;
      const tipX = x + size;
      const tipY = y - size;
      return `M${point(row.left, y)} H${coordinate(x - origin.left)} L${point(tipX, tipY)} M${point(tipX - head, tipY)} H${coordinate(tipX - origin.left)} V${coordinate(tipY + head - origin.top)}`;
    });
    svg.firstElementChild.setAttribute('d', segments.join(' '));
    link.classList.add('is-drawn');
  }

  function refresh() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => links.forEach(draw));
  }
  const resize = new ResizeObserver(refresh);
  document.querySelectorAll(selector).forEach((link) => {
    links.add(link);
    mount(link);
    resize.observe(link);
  });
  // Catch translated text and responsive/theme typography without page-specific fixes.
  const mutations = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          record.type === 'characterData' ||
          (record.type === 'childList' && record.target.matches?.(selector)),
      )
    )
      refresh();
  });
  links.forEach((link) => mutations.observe(link, { childList: true, characterData: true, subtree: true }));
  const appearance = new MutationObserver(refresh);
  appearance.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  });
  appearance.observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[aria-disabled="true"]');
    if (anchor && (anchor.matches('.callout-link') || anchor.querySelector('.callout-link')))
      event.preventDefault();
  });
  document.addEventListener('oda:media-viewer-change', refresh);
  window.addEventListener('resize', refresh);
  document.fonts.ready.then(refresh);
  document.fonts.addEventListener('loadingdone', refresh);
  refresh();
})();
