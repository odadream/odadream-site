const box = document.querySelector('.system-lightbox');
let trigger = null;
const closeBox = () => {
  box.hidden = true;
  box.querySelector('img').removeAttribute('src');
  trigger?.focus();
};
document.querySelectorAll('.system-image-button').forEach((button) => {
  button.addEventListener('click', () => {
    trigger = button;
    const image = button.querySelector('img');
    box.querySelector('img').src = image.currentSrc || image.src;
    box.querySelector('img').alt = image.alt;
    box.hidden = false;
    box.querySelector('button').focus();
  });
});
box.querySelector('button').addEventListener('click', closeBox);
box.addEventListener('click', (event) => { if (event.target === box) closeBox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !box.hidden) closeBox(); });
