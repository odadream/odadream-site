// Native dialog provides focus containment and an inert background.
const mediaButtons = [...document.querySelectorAll('.system-image-button,.image-button')];
const viewer = document.createElement('dialog');
viewer.className = 'media-dialog';
viewer.setAttribute('aria-label', 'Просмотр серии изображений');
viewer.innerHTML = '<div class="media-toolbar"><button type="button" data-prev aria-label="Предыдущее изображение">←</button><span class="media-count" aria-live="polite"></span><button type="button" data-next aria-label="Следующее изображение">→</button><button type="button" data-close aria-label="Закрыть просмотр">×</button></div><figure><img alt=""><figcaption></figcaption></figure><p class="media-error" hidden>Изображение не загрузилось. Закройте просмотр или перейдите к следующему.</p>';
document.body.append(viewer);
let mediaIndex = 0;
let mediaOrigin;
let priorOverflow = '';
const paintMedia = () => {
  const source = mediaButtons[mediaIndex].querySelector('img');
  const image = viewer.querySelector('img');
  viewer.querySelector('.media-error').hidden = true;
  image.hidden = false;
  image.src = source.currentSrc || source.src;
  image.alt = source.alt;
  viewer.querySelector('figcaption').textContent = mediaButtons[mediaIndex].closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
  viewer.querySelector('.media-count').textContent = `${mediaIndex + 1} / ${mediaButtons.length}`;
  viewer.querySelector('[data-prev]').disabled = mediaIndex === 0;
  viewer.querySelector('[data-next]').disabled = mediaIndex === mediaButtons.length - 1;
};
const openMedia = (index, origin) => {
  mediaIndex = index;
  mediaOrigin = origin;
  paintMedia();
  priorOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  viewer.showModal();
  viewer.querySelector('[data-close]').focus();
};
mediaButtons.forEach((button, index) => button.addEventListener('click', event => {
  event.stopImmediatePropagation();
  openMedia(index, button);
}, true));
document.querySelector('[data-open-gallery]')?.addEventListener('click', event => {
  if (mediaButtons.length) openMedia(0, event.currentTarget);
});
viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {document.body.style.overflow = priorOverflow;mediaOrigin?.focus();});
viewer.addEventListener('click', event => {if(event.target === viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
const advance = delta => { const next = mediaIndex + delta;if(next >= 0 && next < mediaButtons.length){mediaIndex = next;paintMedia();}};
viewer.querySelector('[data-prev]').addEventListener('click',()=>advance(-1));
viewer.querySelector('[data-next]').addEventListener('click',()=>advance(1));
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();advance(1);}if(event.key==='ArrowLeft'){event.preventDefault();advance(-1);}});
viewer.querySelector('img').addEventListener('error',()=>{viewer.querySelector('img').hidden=true;viewer.querySelector('.media-error').hidden=false;});
// The specimen has no language script; give it its own mobile navigation.
if(!document.body.dataset.page){
  const toggle=document.querySelector('.menu-button'),nav=document.querySelector('#nav');
  const closeMenu=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');};
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
}
// Internal routes use a forward arrow; external sources retain the diagonal arrow.
function normalizeLinks(){document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(!/^(https?:|mailto:)/.test(href)&&a.children.length===0)a.textContent=a.textContent.replace(/↗/g,'→');});}
normalizeLinks();document.querySelector('.lang-button')?.addEventListener('click',normalizeLinks);
