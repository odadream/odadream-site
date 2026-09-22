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
  const caption = mediaButtons[mediaIndex].closest('figure')?.querySelector('figcaption');
  viewer.querySelector('figcaption').textContent = caption
    ? [...caption.children].map(part => part.textContent.trim()).filter(Boolean).join(' · ')
    : source.alt;
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
mediaButtons.forEach((button, index) => button.addEventListener('click', () => openMedia(index, button)));
document.querySelector('[data-open-gallery]')?.addEventListener('click', event => {
  if (mediaButtons.length) openMedia(0, event.currentTarget);
});
viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {document.body.style.overflow = priorOverflow;viewer.querySelector('img').removeAttribute('src');mediaOrigin?.focus();});
viewer.addEventListener('click', event => {if(event.target === viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
const advance = delta => { const next = mediaIndex + delta;if(next >= 0 && next < mediaButtons.length){mediaIndex = next;paintMedia();}};
viewer.querySelector('[data-prev]').addEventListener('click',()=>advance(-1));
viewer.querySelector('[data-next]').addEventListener('click',()=>advance(1));
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();advance(1);}if(event.key==='ArrowLeft'){event.preventDefault();advance(-1);}});
document.addEventListener('keydown', event => {
  if (!viewer.open || event.key !== 'Tab') return;
  const controls = [...viewer.querySelectorAll('button:not(:disabled)')];
  const index = controls.indexOf(document.activeElement);
  const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
  event.preventDefault();
  controls[next].focus();
}, true);
viewer.addEventListener('focusout', () => {
  queueMicrotask(() => {
    if (viewer.open && !viewer.contains(document.activeElement)) {
      viewer.querySelector('button:not(:disabled)').focus();
    }
  });
});
viewer.querySelector('img').addEventListener('error',()=>{viewer.querySelector('img').hidden=true;viewer.querySelector('.media-error').hidden=false;});
// One navigation controller shared by the specimen and public-page prototypes.
{
  const toggle=document.querySelector('.menu-button'),nav=document.querySelector('#nav');
  const menuLabel = open => document.documentElement.lang === 'en'
    ? (open ? 'Close menu' : 'Open menu') : (open ? 'Закрыть меню' : 'Открыть меню');
  const closeMenu=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',menuLabel(false));toggle.textContent='☰';};
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',menuLabel(open));toggle.textContent=open?'×':'☰';});
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
  window.matchMedia('(min-width:701px)').addEventListener('change', event => {if(event.matches)closeMenu();});
}
// Internal routes use a forward arrow; external sources retain the diagonal arrow.
function normalizeLinks(){document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(!/^(https?:|mailto:)/.test(href)&&a.children.length===0)a.textContent=a.textContent.replace(/↗/g,'→');});}
normalizeLinks();document.querySelector('.lang-button')?.addEventListener('click',normalizeLinks);

function localizeControls(){
  const english = document.documentElement.lang === 'en';
  viewer.setAttribute('aria-label',english?'Image gallery':'Просмотр серии изображений');
  viewer.querySelector('[data-prev]').setAttribute('aria-label',english?'Previous image':'Предыдущее изображение');
  viewer.querySelector('[data-next]').setAttribute('aria-label',english?'Next image':'Следующее изображение');
  viewer.querySelector('[data-close]').setAttribute('aria-label',english?'Close viewer':'Закрыть просмотр');
  viewer.querySelector('.media-error').textContent=english?'The image could not load. Close the viewer or try the next image.':'Изображение не загрузилось. Закройте просмотр или перейдите к следующему.';
  const toggle=document.querySelector('.menu-button');
  const open=toggle?.getAttribute('aria-expanded')==='true';
  toggle?.setAttribute('aria-label',english?(open?'Close menu':'Open menu'):(open?'Закрыть меню':'Открыть меню'));
}
localizeControls();document.querySelector('.lang-button')?.addEventListener('click',localizeControls);

// Specimen values are read from rendered styles, so labels cannot drift from CSS.
function syncSpecimen(){
  document.querySelectorAll('.type-row').forEach(row=>{
    const example=row.querySelector('.type-example'),spec=row.querySelector('.type-spec');
    const css=getComputedStyle(example);
    spec.textContent=`${css.fontFamily.split(',')[0].replaceAll('"','')} ${css.fontWeight} · ${parseFloat(css.fontSize).toFixed(1)} / ${parseFloat(css.lineHeight).toFixed(1)} px`;
  });
}
syncSpecimen();let specimenFrame;
window.addEventListener('resize',()=>{cancelAnimationFrame(specimenFrame);specimenFrame=requestAnimationFrame(syncSpecimen);});
