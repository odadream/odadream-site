import { technicalPaths } from '../lib/technical-marks';
export function initDisclosures() {
  function enhance(root: ParentNode) {
    const summaries = [...root.querySelectorAll('summary')];
    if (root instanceof Element && root.matches('summary')) summaries.unshift(root as HTMLElement);
    summaries.forEach((summary) => {
      if (summary.closest('.reading-contents') || summary.querySelector(':scope > [data-disclosure-mark]'))
        return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('class', 'technical-mark');
      svg.setAttribute('data-disclosure-mark', '');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('fill', 'none');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', technicalPaths.down);
      svg.append(path);
      summary.prepend(svg);
    });
  }
  enhance(document);
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.target instanceof Element && record.target.matches('summary')) enhance(record.target);
      record.addedNodes.forEach((node) => {
        if (node instanceof Element && (node.matches('summary,details') || node.querySelector('summary')))
          enhance(node);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
}
