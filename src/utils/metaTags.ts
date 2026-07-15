import { LotusNode } from "../types";
import { Language } from "../types";

const BASE_URL = "https://odadream.art";
const DEFAULT_IMAGE = `${BASE_URL}/images/assets/oda_preview.png`;
const DEFAULT_DESCRIPTION =
  "ODA.dream is an artist duo working across art, science, and technology through participatory performance, media art, neurotechnology, EEG, and computer vision.";

const setMeta = (selector: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
};

const extractPlainText = (markdown: string, maxLen = 155): string => {
  return markdown
    .replace(/^#+\s+[^\n]*/gm, "")                          // headings
    .replace(/!\[\[[^\]]*\]\]/g, "")                         // ![[embeds]]
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")             // [[id|label]] → label
    .replace(/\[\[([^\]]+)\]\]/g, "$1")                      // [[id]] → id
    .replace(/[*_`~]{1,3}/g, "")                             // bold/italic/code
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")                 // [text](url) → text
    .replace(/^>\s*/gm, "")                                  // blockquotes
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLen);
};

const toAbsoluteUrl = (url: string): string => {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const updateMetaTags = (
  node: LotusNode,
  lang: Language,
  rootId: string,
): void => {
  const isRoot = node.id === rootId;
  const nodeTitle = node.title[lang] || node.title.en;
  const fullTitle = isRoot
    ? "ODA.dream | Art, Science & Technology"
    : `${nodeTitle} | ODA.dream`;

  const rawDesc = node.description[lang] || node.description.en || "";
  const description = extractPlainText(rawDesc) || DEFAULT_DESCRIPTION;

  const image = toAbsoluteUrl(node.imageUrl || "");

  const p = new URLSearchParams();
  if (!isRoot) p.set("id", node.id);
  p.set("lang", lang);
  const pageUrl = `${BASE_URL}/?${p.toString()}`;

  // Title
  document.title = fullTitle;

  // Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", pageUrl);

  // Standard
  setMeta('meta[name="description"]', description);

  // Open Graph
  setMeta('meta[property="og:title"]', fullTitle);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:url"]', pageUrl);

  // Twitter / X
  setMeta('meta[name="twitter:title"]', fullTitle);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
  setMeta('meta[name="twitter:url"]', pageUrl);
};
