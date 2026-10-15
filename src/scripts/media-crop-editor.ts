import '../styles/media-crop-editor.css';
import {
  readCompositionDraft,
  defaultComposition,
  validComposition,
  compositionTransform,
  type CropView,
  type CropViewport,
  type Composition,
} from '../lib/media-composition';
export function initMediaCropEditor() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-dev-crop-dialog]');
  if (!dialog) return;
  const q = <T extends HTMLElement>(s: string) => dialog.querySelector<T>(s)!;
  const original = q<HTMLImageElement>('[data-crop-original]');
  const profile = q<HTMLSelectElement>('[data-crop-profile]');
  const viewport = q<HTMLSelectElement>('[data-crop-viewport]');
  const mode = q<HTMLSelectElement>('[data-crop-mode]');
  const status = q('[data-crop-status]');
  const fields = [...dialog.querySelectorAll<HTMLInputElement>('[data-crop-field]')];
  const ru = document.documentElement.lang === 'ru';
  const key = 'oda.media-composition.v1';
  let drafts = readCompositionDraft('{}');
  try {
    drafts = readCompositionDraft(localStorage.getItem(key) ?? '{}');
  } catch {
    /* private browser storage */
  }
  let id = '';
  let opener: HTMLElement | undefined;
  const base = (v: CropViewport = viewport.value as CropViewport, trigger = opener) => {
    const c = defaultComposition();
    const focal = trigger?.dataset.cropFocal ?? 'center';
    c.point = {
      x: focal.includes('left') ? 0 : focal.includes('right') ? 1 : 0.5,
      y: focal.includes('top') ? 0 : focal.includes('bottom') ? 1 : 0.5,
    };
    try {
      const point = JSON.parse(
        (v === 'mobile' ? trigger?.dataset.cropPointMobile : trigger?.dataset.cropPointDesktop) ?? 'null',
      );
      if (point && validComposition({ ...c, point })) c.point = point;
    } catch {
      /* Invalid exported values fall back to the named focal point. */
    }
    return c;
  };
  const get = (v: CropViewport): Composition => {
    drafts.media[id] ??= {};
    const profiles = drafts.media[id];
    const p = profile.value as CropView;
    profiles[p] ??= {};
    profiles[p]![v] ??= base(v);
    return profiles[p]![v]!;
  };
  const current = () => get(viewport.value as CropViewport);
  const message = (a: string, b: string) => {
    status.textContent = ru ? a : b;
  };
  const applyPoints = () => {
    const v: CropViewport = matchMedia('(max-width:700px)').matches ? 'mobile' : 'desktop';
    for (const trigger of document.querySelectorAll<HTMLElement>('[data-dev-crop]')) {
      const mediaId = trigger.dataset.cropId!;
      const view = trigger.dataset.cropView as CropView;
      const root = trigger.closest('.work-card, .media-figure, .nm-slide');
      const c = drafts.media[mediaId]?.[view]?.[v];
      if (!root) continue;
      const fallback = base(v, trigger).point;
      for (const image of root.querySelectorAll<HTMLImageElement | HTMLVideoElement>('img,video')) {
        image.style.objectPosition =
          c?.mode === 'point'
            ? c.point.x * 100 + '% ' + c.point.y * 100 + '%'
            : fallback.x * 100 + '% ' + fallback.y * 100 + '%';
      }
    }
  };
  const render = (syncFocusedField = false) => {
    if (!id) return;
    const c = current();
    mode.value = c.mode;
    for (const field of fields) {
      const name = field.dataset.cropField as 'x' | 'y' | 'width' | 'height';
      field.disabled = c.mode === 'point' && (name === 'width' || name === 'height');
      // Image load and layout observers must not erase an edit before its change event.
      if (syncFocusedField || document.activeElement !== field)
        field.value = String(
          name === 'x' || name === 'y'
            ? c.mode === 'point'
              ? c.point[name]
              : c.region[name]
            : c.region[name],
        );
    }
    const point = q('[class="dev-crop-point"]');
    point.hidden = c.mode !== 'point';
    point.style.left = c.point.x * 100 + '%';
    point.style.top = c.point.y * 100 + '%';
    const region = q('[class="dev-crop-region"]');
    region.hidden = c.mode !== 'region';
    Object.assign(region.style, {
      left: c.region.x * 100 + '%',
      top: c.region.y * 100 + '%',
      width: c.region.width * 100 + '%',
      height: c.region.height * 100 + '%',
    });
    for (const frame of dialog.querySelectorAll<HTMLElement>('[data-crop-frame]')) {
      const v = frame.dataset.cropFrame as CropViewport;
      const ratio =
        profile.value === 'card'
          ? 1.6
          : profile.value === 'gallery'
            ? 4 / 3
            : v === 'desktop'
              ? 16 / 9
              : 9 / 16;
      frame.style.aspectRatio = String(ratio);
      const fw = frame.getBoundingClientRect().width;
      const fh = fw / ratio;
      const image = frame.querySelector<HTMLImageElement>('img')!;
      const window = frame.querySelector<HTMLElement>('.dev-crop-window')!;
      if (original.naturalWidth && fw) {
        const t = compositionTransform(original.naturalWidth, original.naturalHeight, fw, fh, get(v));
        Object.assign(window.style, { width: t.windowWidth + 'px', height: t.windowHeight + 'px' });
        Object.assign(image.style, {
          width: t.imageWidth + 'px',
          height: t.imageHeight + 'px',
          left: t.left + 'px',
          top: t.top + 'px',
        });
      }
    }
    applyPoints();
  };
  document.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-dev-crop]');
    if (!target) return;
    opener = target;
    id = target.dataset.cropId!;
    profile.value = target.dataset.cropView ?? 'card';
    viewport.value = matchMedia('(max-width:700px)').matches ? 'mobile' : 'desktop';
    q('[data-crop-name]').textContent = target.dataset.cropTitle ?? id;
    original.src = target.dataset.cropSrc!;
    for (const image of dialog.querySelectorAll<HTMLImageElement>('.dev-crop-frame img'))
      image.src = original.src;
    q<HTMLTextAreaElement>('[data-crop-json]').value = '';
    dialog.showModal();
    document.dispatchEvent(new Event('oda:media-viewer-change'));
    message('Изменения пока в черновике DEV.', 'Changes are a DEV draft.');
    render(true);
  });
  original.addEventListener('load', () => render());
  original.addEventListener('error', () =>
    message('Не удалось открыть исходное изображение.', 'Could not load the original image.'),
  );
  original.addEventListener('click', (event) => {
    const box = original.getBoundingClientRect();
    const c = current();
    c.mode = 'point';
    c.point = {
      x: Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)),
    };
    render(true);
    message('Изменения не сохранены.', 'Changes are not saved.');
  });
  profile.addEventListener('change', () => render(true));
  viewport.addEventListener('change', () => render(true));
  mode.addEventListener('change', () => {
    current().mode = mode.value as Composition['mode'];
    render(true);
    message('Изменения не сохранены.', 'Changes are not saved.');
  });
  for (const field of fields)
    field.addEventListener('change', () => {
      const c = structuredClone(current());
      const name = field.dataset.cropField as 'x' | 'y' | 'width' | 'height';
      const value = Number(field.value);
      if (c.mode === 'point' && (name === 'x' || name === 'y')) c.point[name] = value;
      else c.region[name] = value;
      if (!validComposition(c)) {
        message(
          'Область должна помещаться в оригинале; все координаты — от 0 до 1.',
          'The region must fit within the original; all coordinates range from 0 to 1.',
        );
        render(true);
        return;
      }
      drafts.media[id]![profile.value as CropView]![viewport.value as CropViewport] = c;
      render(true);
      message('Изменения не сохранены.', 'Changes are not saved.');
    });
  q('[data-crop-save]').addEventListener('click', () => {
    try {
      localStorage.setItem(key, JSON.stringify(drafts));
      message(
        'Черновик сохранён в этом браузере. PUBLIC не изменён.',
        'Draft saved in this browser. PUBLIC is unchanged.',
      );
    } catch {
      message(
        'Хранилище недоступно; сохраните экспорт JSON.',
        'Storage is unavailable; save the JSON export.',
      );
    }
  });
  q('[data-crop-reset]').addEventListener('click', () => {
    drafts.media[id]![profile.value as CropView]![viewport.value as CropViewport] = base();
    render(true);
    message('Изменения не сохранены.', 'Changes are not saved.');
  });
  q('[data-crop-export]').addEventListener('click', () => {
    const text = JSON.stringify(drafts, null, 2);
    q<HTMLTextAreaElement>('[data-crop-json]').value = text;
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'media-composition-draft.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message(
      'JSON подготовлен; применение к PUBLIC требует переноса в данные.',
      'JSON is ready; applying it to PUBLIC requires transfer to the data layer.',
    );
  });
  dialog.addEventListener('close', () => {
    document.dispatchEvent(new Event('oda:media-viewer-change'));
    opener?.focus();
  });
  const observer = new ResizeObserver(() => {
    if (dialog.open) render();
  });
  for (const frame of dialog.querySelectorAll('.dev-crop-frame')) observer.observe(frame);
  window.addEventListener('resize', () => {
    if (dialog.open) render();
    else applyPoints();
  });
  applyPoints();
}
