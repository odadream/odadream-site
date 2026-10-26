const site = 'https://odadream.art';
const attributes = (tag) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

/** Validate the emitted HTML, so build-time flags and actual metadata are checked together. */
export function validateSeo(html, path) {
  const head = html.split('</head>')[0];
  const tags = [...head.matchAll(/<(?:meta|link)\b[^>]*>/g)].map((match) => attributes(match[0]));
  const canonical = new URL(path, site).href;
  const links = tags.filter((tag) => tag.rel === 'canonical');
  if (links.length !== 1 || links[0].href !== canonical) throw Error(`Invalid canonical: ${path}`);
  if (tags.some((tag) => tag.name === 'robots' && /noindex|none/i.test(tag.content ?? '')))
    throw Error(`Indexable page blocked by robots meta: ${path}`);
  if (!tags.some((tag) => tag.name === 'description' && tag.content?.trim()))
    throw Error(`Missing description: ${path}`);
  for (const lang of ['en', 'ru']) {
    const expected = new URL(path.replace(/^\/(en|ru)\//, `/${lang}/`), site).href;
    if (!tags.some((tag) => tag.rel === 'alternate' && tag.hreflang === lang && tag.href === expected))
      throw Error(`Invalid ${lang} alternate: ${path}`);
  }
  if (!tags.some((tag) => tag.property === 'og:url' && tag.content === canonical))
    throw Error(`Invalid Open Graph URL: ${path}`);
  const image = tags.find((tag) => tag.property === 'og:image')?.content;
  if (
    !image ||
    !/^https:\/\//.test(image) ||
    !/\.(?:avif|webp|png|jpe?g|gif|svg)$/i.test(new URL(image).pathname)
  )
    throw Error(`Open Graph requires a still image: ${path}`);
  for (const match of head.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1]);
    } catch {
      throw Error(`Invalid JSON-LD: ${path}`);
    }
  }
  return image;
}
