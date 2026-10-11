/** One viewer for standalone media, gallery selections and documentary scans. */
export function initMediaViewer() {
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
  if (!dialog) return;
  const image = dialog.querySelector<HTMLImageElement>('img')!;
  const video = dialog.querySelector<HTMLVideoElement>('video')!;
  const caption = dialog.querySelector<HTMLElement>('.lightbox-caption')!;
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
  function resetZoom() {
    delete dialog!.dataset.zoomed;
    zoom.setAttribute('aria-pressed', 'false');
    stage.tabIndex = -1;
    stage.scrollTo(0, 0);
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
  }
  function show(offset = 0) {
    index = (index + offset + items.length) % items.length;
    const item = items[index];
    unload();
    const moving = item.dataset.kind === 'video';
    zoom.hidden = moving;
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
    caption.textContent = [item.dataset.caption, item.dataset.credit].filter(Boolean).join(' · ');
    position.textContent = `${index + 1} / ${items.length}`;
    previous.hidden = next.hidden = items.length < 2;
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-lightbox]')) {
    button.addEventListener('click', () => {
      trigger = button;
      const gallery = button.hasAttribute('data-gallery-item')
        ? button.closest('[data-media-gallery]')
        : null;
      items = gallery ? [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-item]')] : [button];
      index = items.indexOf(button);
      show();
      dialog.showModal();
      document.dispatchEvent(new Event('oda:media-viewer-change'));
    });
  }
  zoom.addEventListener('click', () => {
    const zoomed = !dialog.dataset.zoomed;
    if (!zoomed) resetZoom();
    else {
      dialog.dataset.zoomed = 'true';
      zoom.setAttribute('aria-pressed', 'true');
      stage.tabIndex = 0;
    }
  });
  previous.addEventListener('click', () => show(-1));
  next.addEventListener('click', () => show(1));
  dialog.addEventListener('keydown', (event) => {
    // Player seeking/volume keep native keyboard behavior.
    if (event.target === video || (event.target === stage && dialog.dataset.zoomed) || items.length < 2)
      return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.querySelector<HTMLButtonElement>('.lightbox-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    unload();
    trigger?.focus();
    document.dispatchEvent(new Event('oda:media-viewer-change'));
  });
  image.addEventListener('error', () => {
    if (dialog.open && !image.hidden)
      status.textContent = ru
        ? 'Изображение недоступно. Можно перейти к следующему материалу.'
        : 'Image unavailable. You can move to the next item.';
  });
  video.addEventListener('error', () => {
    if (dialog.open && !video.hidden)
      status.textContent = ru
        ? 'Видео недоступно. Закройте просмотр или выберите другой материал.'
        : 'Video unavailable. Close the viewer or choose another item.';
  });
}
