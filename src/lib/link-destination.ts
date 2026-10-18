import { familyByKind, type PageFamily } from './page-codes';
import type { PageKind } from './routes';
export type LinkDestination = 'internal' | 'external' | 'section' | 'resource' | 'contact';

/** Destination semantics are independent of target=_blank and the link's wording. */
export function linkDestination(href: string, currentHref: string, canonicalHref: string): LinkDestination {
  const current = new URL(currentHref);
  const target = new URL(href, current);
  if (['mailto:', 'tel:'].includes(target.protocol)) return 'contact';
  const sameSite = target.origin === current.origin || target.origin === new URL(canonicalHref).origin;
  if (/\.(pdf|zip|docx?|xlsx?|pptx?)$/i.test(target.pathname)) return 'resource';
  if (!sameSite) return 'external';
  if (target.pathname === current.pathname && target.search === current.search && target.hash)
    return 'section';
  return 'internal';
}

/** Use the same family registry as navigation, independent of language and local origin. */
export function linkTargetFamily(href: string, currentHref: string): PageFamily {
  const parts = new URL(href, currentHref).pathname.split('/').filter(Boolean);
  if (['ru', 'en'].includes(parts[0])) parts.shift();
  const section = parts[0] ?? 'home';
  if (['design-system', 'link-test', 'editorial'].includes(section)) return 'D';
  return familyByKind[section as PageKind] ?? 'H';
}
