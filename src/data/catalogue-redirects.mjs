/** V2 routes changed by the owner's classification corrections, not V1 ID routing. */
export const catalogueRedirects = {
  '/works/theatre-of-my-name/': '/education/theatre-of-my-name/',
  '/works/brain-hack/': '/education/brain-hack/',
  '/works/journey-to-yourself/': '/education/journey-to-yourself/',
  '/education/gong-theatre/': '/works/neuro-gong-theatre/',
};
export const localizedCatalogueRedirects = Object.fromEntries(
  ['ru', 'en'].flatMap((lang) =>
    Object.entries(catalogueRedirects).map(([from, to]) => [`/${lang}${from}`, `/${lang}${to}`]),
  ),
);
