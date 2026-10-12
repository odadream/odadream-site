import type { initVideoPreviews } from './video-previews';
/** A new shuffle on every page load; only an active video's ended event advances the queue. */
export function initHeroCarousel(previews: ReturnType<typeof initVideoPreviews>) {
  const carousel = document.querySelector<HTMLElement>('[data-carousel]');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-slide]')];
  if (!slides.length) return;
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  const field = carousel.querySelector<HTMLElement>('.nm-hero__field') ?? carousel;
  const heading = field.querySelector('.nm-heading');
  slides.forEach((slide, index) => {
    field.insertBefore(slide, heading);
    slide.hidden = index !== 0;
    const position = slide.querySelector('[data-carousel-position]');
    if (position)
      position.textContent =
        String(index + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  });
  let current = 0;
  const show = (next: number) => {
    const focused = document.activeElement;
    const hadSlideFocus = slides[current].contains(focused);
    const control = ['data-carousel-prev', 'data-carousel-next'].find((name) => focused?.hasAttribute(name));
    slides[current].hidden = true;
    current = (next + slides.length) % slides.length;
    slides[current].hidden = false;
    if (control)
      slides[current].querySelector<HTMLButtonElement>('[' + control + ']')?.focus({ preventScroll: true });
    else if (hadSlideFocus)
      slides[current].querySelector<HTMLAnchorElement>('.nm-caption-link a')?.focus({ preventScroll: true });
    previews.refresh();
  };
  carousel
    .querySelectorAll('[data-carousel-prev]')
    .forEach((button) => button.addEventListener('click', () => show(current - 1)));
  carousel
    .querySelectorAll('[data-carousel-next]')
    .forEach((button) => button.addEventListener('click', () => show(current + 1)));
  slides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    video?.addEventListener('ended', () => {
      previews.refresh();
      if (index === current && previews.isActive(video)) show(current + 1);
    });
  });
  carousel.dataset.carouselReady = 'true';
  previews.refresh();
}
