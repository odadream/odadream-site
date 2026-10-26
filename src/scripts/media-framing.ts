import '../styles/media-framing.css';
import { parseFramingDrafts, canonicalFocus, type Framing } from '../lib/framing-drafts';
export function initMediaFraming() {
  const root = document;
  const ru = document.documentElement.lang !== 'en';
  if (!root.querySelector('[data-study-dialog]')) return;
  const storageKey = 'oda.media-framing.v2';
  const readDrafts = () => {
    try {
      return parseFramingDrafts(localStorage.getItem(storageKey));
    } catch {
      return parseFramingDrafts(null);
    }
  };
  let drafts = readDrafts();
  let activeId = '';
  let baselineFocus = { x: 50, y: 50 };
  const applyToGallery = () => {
    root.querySelectorAll<HTMLElement>('.media-figure[data-media-id]').forEach((figure) => {
      const draft = drafts[figure.dataset.mediaId!];
      figure.dataset.devFraming = draft?.fit ?? 'natural';
      figure.style.setProperty('--dev-framing-position', `${draft?.x ?? 50}% ${draft?.y ?? 50}%`);
    });
  };
  // A single per-media draft also updates repeated cover instances without changing viewer originals.
  const applyAll = () => {
    applyToGallery();
    root.querySelectorAll<HTMLElement>('.work-card, .nm-slide').forEach((card) => {
      const trigger = card.querySelector<HTMLElement>('[data-study-crop]');
      const draft = trigger ? drafts[trigger.dataset.name!] : undefined;
      if (draft) {
        card.dataset.devFraming = draft.fit;
        card.style.setProperty('--dev-framing-position', `${draft.x}% ${draft.y}%`);
      } else {
        delete card.dataset.devFraming;
        card.style.removeProperty('--dev-framing-position');
      }
    });
  };
  const persist = () => {
    let saved = true;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ schemaVersion: 2, media: drafts }));
    } catch {
      saved = false;
    }
    applyAll();
    document.dispatchEvent(new Event('oda:media-drafts-changed'));
    return saved;
  };
  applyAll();
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    drafts = readDrafts();
    applyAll();
  });
  const dialog = root.querySelector<HTMLDialogElement>('[data-study-dialog]')!;
  const original = root.querySelector<HTMLElement>('[data-study-original]')!;
  const image = original.querySelector('img')!;
  const x = root.querySelector<HTMLInputElement>('[data-study-x]')!;
  const y = root.querySelector<HTMLInputElement>('[data-study-y]')!;
  const fit = root.querySelector<HTMLSelectElement>('[data-study-fit]')!;
  const status = root.querySelector<HTMLElement>('[data-study-status]')!;
  const point = () => {
    original.style.setProperty('--study-x', `${x.value}%`);
    original.style.setProperty('--study-y', `${y.value}%`);
    status.textContent =
      document.documentElement.lang === 'en' ? 'Changes await application.' : 'Изменения ожидают применения.';
  };
  [x, y, fit].forEach((input) => input.addEventListener('input', point));
  image.addEventListener('click', (event) => {
    const bounds = image.getBoundingClientRect();
    x.value = String(Math.round(((event.clientX - bounds.left) / bounds.width) * 100));
    y.value = String(Math.round(((event.clientY - bounds.top) / bounds.height) * 100));
    point();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-study-crop]').forEach((button) =>
    button.addEventListener('click', () => {
      image.src = button.dataset.src!;
      root.querySelector('[data-study-name]')!.textContent = button.dataset.name!;
      root
        .querySelectorAll<HTMLImageElement>('[data-study-previews] img')
        .forEach((preview) => (preview.src = button.dataset.src!));
      activeId = button.dataset.name!;
      baselineFocus = canonicalFocus(button.dataset.cropPointDesktop, button.dataset.cropFocal);
      const draft = drafts[activeId];
      x.value = String(draft?.x ?? baselineFocus.x);
      y.value = String(draft?.y ?? baselineFocus.y);
      fit.value = draft?.fit ?? 'natural';
      point();
      root.querySelector<HTMLElement>('[data-study-previews]')!.hidden = true;
      dialog.showModal();
    }),
  );
  root.querySelector('[data-study-apply]')!.addEventListener('click', () => {
    const previews = root.querySelector<HTMLElement>('[data-study-previews]')!;
    previews.hidden = false;
    previews.dataset.fit = fit.value;
    previews.style.setProperty('--study-position', `${x.value}% ${y.value}%`);
    const draft = { x: Number(x.value), y: Number(y.value), fit: fit.value as Framing['fit'] };
    if (draft.fit === 'natural' && draft.x === baselineFocus.x && draft.y === baselineFocus.y)
      delete drafts[activeId];
    else drafts[activeId] = draft;
    const saved = persist();
    status.textContent = ru
      ? `Применено: фокус ${x.value}% / ${y.value}%. ${saved ? 'Черновик сохранён в браузере; сервер не изменён.' : 'Хранилище недоступно: изменения останутся только до перезагрузки.'}`
      : `Applied: focus ${x.value}% / ${y.value}%. ${saved ? 'Draft saved in this browser; server unchanged.' : 'Storage unavailable: changes last until reload.'}`;
  });
  root.querySelector('[data-study-reset]')!.addEventListener('click', () => {
    delete drafts[activeId];
    x.value = String(baselineFocus.x);
    y.value = String(baselineFocus.y);
    fit.value = 'natural';
    point();
    root.querySelector<HTMLElement>('[data-study-previews]')!.hidden = true;
    persist();
    status.textContent = ru
      ? 'Восстановлены настройки сайта. Черновик этого материала удалён.'
      : 'Site settings restored. This media draft was removed.';
  });
}
