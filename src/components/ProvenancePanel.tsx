import React from "react";
import {
  type LucideIcon,
  ArrowUpRight, Award, BookMarked, BookOpen, Building2, Calendar, Cpu,
  FileText, Film, FlaskConical, Gamepad2, Globe, GraduationCap, Hammer,
  Handshake, HeartHandshake, Image, Landmark, Lock, Mail, MapPin,
  MessageSquare, Mic, Mic2, Newspaper, Palette, PencilLine, Quote, Radio,
  ShoppingBag, Sparkle, Sparkles, Tag, Target, Trophy, UserRound, Users,
} from "lucide-react";

import { LotusNode } from "../types";
import { useNavigation, useLightbox } from "../context/NavigationContext";
import { getProvenance, hasAnyProvenance, type Provenance } from "../utils/provenance";
import { subkindMeta, KIND_LABELS } from "../data/taxonomy";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Explicit icon map — keeps lucide tree-shaking effective. Adding a new
// taxonomy icon means registering it here AND in src/data/taxonomy.ts.
const ICON_MAP: Record<string, LucideIcon> = {
  ArrowUpRight, Award, BookMarked, BookOpen, Building2, Calendar, Cpu,
  FileText, Film, FlaskConical, Gamepad2, Globe, GraduationCap, Hammer,
  Handshake, HeartHandshake, Image, Landmark, Lock, Mail, MapPin,
  MessageSquare, Mic, Mic2, Newspaper, Palette, PencilLine, Quote, Radio,
  ShoppingBag, Sparkle, Sparkles, Tag, Target, Trophy, UserRound, Users,
};

const iconFor = (name?: string): LucideIcon => (name && ICON_MAP[name]) || Tag;

/** Tailwind colour family → border/text classes used by chips. */
const CHIP_COLOUR: Record<string, string> = {
  amber:   "text-amber-400/90  ring-amber-400/30  hover:bg-amber-400/10",
  cyan:    "text-cyan-400/90   ring-cyan-400/30   hover:bg-cyan-400/10",
  sky:     "text-sky-400/90    ring-sky-400/30    hover:bg-sky-400/10",
  purple:  "text-purple-400/90 ring-purple-400/30 hover:bg-purple-400/10",
  emerald: "text-emerald-400/90 ring-emerald-400/30 hover:bg-emerald-400/10",
  rose:    "text-rose-400/90   ring-rose-400/30   hover:bg-rose-400/10",
  indigo:  "text-indigo-400/90 ring-indigo-400/30 hover:bg-indigo-400/10",
  stone:   "text-txt-muted     ring-border/40     hover:bg-surface/40",
  teal:    "text-teal-400/90   ring-teal-400/30   hover:bg-teal-400/10",
  fuchsia: "text-fuchsia-400/90 ring-fuchsia-400/30 hover:bg-fuchsia-400/10",
  lime:    "text-lime-400/90   ring-lime-400/30   hover:bg-lime-400/10",
  orange:  "text-orange-400/90 ring-orange-400/30 hover:bg-orange-400/10",
};

const chipClassFor = (color?: string) => CHIP_COLOUR[color ?? "stone"] ?? CHIP_COLOUR.stone;

// ---------------------------------------------------------------------------
// NodeChip — clickable chip for any LotusNode
// ---------------------------------------------------------------------------

const NodeChip: React.FC<{
  node: LotusNode;
  lang: "en" | "ru";
  onClick: (id: string) => void;
}> = ({ node, lang, onClick }) => {
  const meta = subkindMeta(node.kind, node.subkind);
  const Icon = iconFor(meta.icon);
  const label = node.shortTitle?.[lang] || node.title[lang] || node.id;
  return (
    <button
      type="button"
      onClick={() => onClick(node.id)}
      title={node.title[lang]}
      className={`group inline-flex items-center gap-1.5 px-2 py-1 ring-1 transition-colors text-[11px] font-mono ${chipClassFor(meta.color)}`}
    >
      <Icon className="w-3 h-3 opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
      <span className="truncate max-w-[24ch]">{label}</span>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

const Section: React.FC<{
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}> = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-txt-dim">
      {Icon && <Icon className="w-3 h-3" strokeWidth={1.5} />}
      <span>{label}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

// Deduplicate nodes by id, preserving first occurrence order.
const uniqueById = (nodes: LotusNode[]): LotusNode[] => {
  const seen = new Set<string>();
  const out: LotusNode[] = [];
  for (const n of nodes) {
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    out.push(n);
  }
  return out;
};

// ---------------------------------------------------------------------------
// Stat — single number+label pair for event attendance
// ---------------------------------------------------------------------------

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-start">
    <span className="text-[10px] font-mono uppercase tracking-widest text-txt-dim">
      {label}
    </span>
    <span className="text-base font-mono text-hud">
      {new Intl.NumberFormat("ru-RU").format(value)}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// ProvenancePanel
// ---------------------------------------------------------------------------

export const ProvenancePanel: React.FC<{ node: LotusNode }> = ({ node }) => {
  const { nodeRegistry, lang, jumpToId } = useNavigation();
  const { openLightbox } = useLightbox();

  const prov = React.useMemo<Provenance>(
    () => getProvenance(node, nodeRegistry),
    [node, nodeRegistry],
  );

  if (!node.kind || !hasAnyProvenance(prov)) return null;

  // ---- Kind-aware merged views (avoid duplicate event/product chips) ----
  // Product: events where this product was shown (direct + inverse backfill).
  // Event: products shown at this event (direct + inverse backfill).
  // Organizer: rollup handled separately below.
  const eventsForProduct =
    node.kind === "product"
      ? uniqueById([...prov.presented_at, ...prov.inverse.presented_here])
      : [];

  const productsAtEvent =
    node.kind === "event"
      ? uniqueById([...prov.products, ...prov.inverse.shown_in])
      : node.kind === "organizer"
        ? uniqueById([
            ...prov.products,
            ...prov.inverse.products_from_events,
          ])
        : [];

  const proofsAbout     = uniqueById([...prov.proofs, ...prov.inverse.proofs_about]);
  const subjectsOfProof = uniqueById([...prov.proof_of, ...prov.inverse.proves]);
  const issuersOfProof  = uniqueById([...prov.issued_by, ...prov.inverse.proofs_issued]);
  const worksAbout      = uniqueById([...prov.about, ...prov.inverse.works_about]);
  const artifactsForSubject =
    node.kind === "event" || node.kind === "product"
      ? uniqueById(prov.inverse.works_about)
      : [];

  const hasDates = node.date_start || node.date_end || node.venue;
  const hasStats =
    typeof node.attendance?.visitors === "number" ||
    typeof node.attendance?.contacts === "number";

  // Section headings — bilingual, mirror the kind label scheme.
  const T = lang === "ru"
    ? {
        title: "Связи",
        kind: KIND_LABELS[node.kind][lang],
        when: "Когда / где",
        organizer: "Организатор",
        client: "Заказчик",
        clientEngagements: "Участия как заказчик",
        productsShown: "Показано",
        shownAt: "Показано на",
        proofs: "Пруфы",
        proofAbout: "О чём",
        issuedBy: "Выдано",
        organized: "Организовал событий",
        productsHosted: "Показанные продукты",
        publication: "Публикация",
        quote: "Цитата",
        attendance: "Посещаемость",
        visitors: "Посетителей",
        contacts: "Контактов",
        website: "Сайт",
        media: "Медиа",
        artifacts: "Артефакты",
        workAbout: "О чём",
        externalSite: "Полный архив проекта",
        workStatus: "Статус работы",
        accessPublic: "Открытый доступ",
        accessRestricted: "Ограниченный доступ",
        accessPrivate: "Частный",
        forSale: "Купить / лицензировать",
      }
    : {
        title: "Provenance",
        kind: KIND_LABELS[node.kind][lang],
        when: "When / where",
        organizer: "Organizer",
        client: "Client",
        clientEngagements: "Engagements as client",
        productsShown: "Shown",
        shownAt: "Shown at",
        proofs: "Proofs",
        proofAbout: "About",
        issuedBy: "Issued by",
        organized: "Organized events",
        productsHosted: "Products shown",
        publication: "Publication",
        quote: "Quote",
        attendance: "Attendance",
        visitors: "Visitors",
        contacts: "Contacts",
        website: "Website",
        media: "Media",
        artifacts: "Artifacts",
        workAbout: "About",
        externalSite: "Project archive",
        workStatus: "Work status",
        accessPublic: "Public access",
        accessRestricted: "Restricted access",
        accessPrivate: "Private",
        forSale: "Buy / license",
      };

  const sub = subkindMeta(node.kind, node.subkind);
  const SubIcon = iconFor(sub.icon);

  return (
    <section
      className="mt-10 pt-6 border-t border-border-dim max-w-[var(--reading-width)]"
      aria-label={T.title}
    >
      <header className="flex items-center gap-2 mb-5">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-txt-dim">
          {T.title}
        </span>
        <span className="flex-1 border-t border-border-dim/40" />
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 ring-1 text-[10px] font-mono uppercase tracking-widest ${chipClassFor(sub.color)}`}
        >
          <SubIcon className="w-3 h-3" strokeWidth={1.5} />
          {T.kind}
          {node.subkind && (
            <span className="opacity-60">· {sub.label[lang]}</span>
          )}
        </span>
      </header>

      {/* EXTERNAL SUBSITE CTA — full-width banner above sections.
          Renders only when a product/event has a canonical external archive. */}
      {node.external_site && (
        <a
          href={node.external_site}
          target="_blank"
          rel="noopener noreferrer"
          className="group block ring-1 ring-accent/40 hover:ring-accent/80 transition-all bg-accent/[0.05] hover:bg-accent/[0.10] px-4 py-3 mb-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent/80">
                {node.external_site_label?.[lang] || T.externalSite}
              </span>
              <span className="text-sm font-mono text-hud">
                {node.external_site.replace(/^https?:\/\//, "")}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      )}

      <div className="flex flex-col gap-6">
        {/* WORK STATUS (media works only) — access + for_sale --------- */}
        {(node.access || node.for_sale) && node.kind === "media" && (
          <Section label={T.workStatus} icon={Lock}>
            {node.access && (
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 ring-1 text-[11px] font-mono ${
                  node.access === "public"
                    ? "text-emerald-400/90 ring-emerald-400/30"
                    : node.access === "restricted"
                      ? "text-amber-400/90 ring-amber-400/30"
                      : "text-rose-400/90 ring-rose-400/30"
                }`}
              >
                <Lock className="w-3 h-3" strokeWidth={1.5} />
                {node.access === "public"
                  ? T.accessPublic
                  : node.access === "restricted"
                    ? T.accessRestricted
                    : T.accessPrivate}
              </span>
            )}
            {node.for_sale &&
              (node.purchase_url ? (
                <a
                  href={node.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-accent/50 hover:bg-accent/10 transition-colors text-[11px] font-mono text-accent"
                >
                  <ShoppingBag className="w-3 h-3" strokeWidth={1.5} />
                  {T.forSale}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-accent/40 text-[11px] font-mono text-accent/80">
                  <ShoppingBag className="w-3 h-3" strokeWidth={1.5} />
                  {T.forSale}
                </span>
              ))}
          </Section>
        )}

        {/* WHEN / WHERE (events) ---------------------------------------- */}
        {hasDates && (
          <Section label={T.when} icon={Calendar}>
            {(node.date_start || node.date_end) && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-border/40 text-[11px] font-mono text-txt-muted">
                <Calendar className="w-3 h-3" strokeWidth={1.5} />
                {node.date_start ?? ""}
                {node.date_end && node.date_end !== node.date_start ? ` — ${node.date_end}` : ""}
              </span>
            )}
            {node.venue && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-border/40 text-[11px] font-mono text-txt-muted">
                <MapPin className="w-3 h-3" strokeWidth={1.5} />
                {node.venue}
              </span>
            )}
          </Section>
        )}

        {/* ORGANIZERS (events) ------------------------------------------ */}
        {prov.organizer.length > 0 && (
          <Section label={T.organizer} icon={Users}>
            {prov.organizer.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* CLIENT (events — commercial host) ------------------------------ */}
        {prov.client.length > 0 && node.kind === "event" && (
          <Section label={T.client} icon={iconFor("Building2")}>
            {prov.client.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* CLIENT EVENTS (organizer org view) ----------------------------- */}
        {prov.inverse.client_events.length > 0 && node.kind === "organizer" && (
          <Section label={T.clientEngagements} icon={iconFor("Handshake")}>
            {prov.inverse.client_events.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* PRODUCTS at event (event / organizer only) ------------------- */}
        {productsAtEvent.length > 0 && (node.kind === "event" || node.kind === "organizer") && (
          <Section
            label={node.kind === "organizer" ? T.productsHosted : T.productsShown}
            icon={iconFor("Sparkles")}
          >
            {productsAtEvent.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* EVENTS for product (product only) ---------------------------- */}
        {eventsForProduct.length > 0 && node.kind === "product" && (
          <Section label={T.shownAt} icon={iconFor("Calendar")}>
            {eventsForProduct.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* ORGANIZED EVENTS (organizer view) ---------------------------- */}
        {prov.inverse.organized_events.length > 0 && node.kind === "organizer" && (
          <Section label={T.organized} icon={iconFor("Calendar")}>
            {prov.inverse.organized_events.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* ARTIFACTS (event / product) ---------------------------------- */}
        {artifactsForSubject.length > 0 && (
          <Section label={T.artifacts} icon={iconFor("Image")}>
            {artifactsForSubject.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* PROOFS (events / products) ----------------------------------- */}
        {proofsAbout.length > 0 && (
          <Section label={T.proofs} icon={Award}>
            {proofsAbout.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* PROOF-SPECIFIC: ABOUT + ISSUED BY ---------------------------- */}
        {subjectsOfProof.length > 0 && (
          <Section label={T.proofAbout} icon={iconFor("Target")}>
            {subjectsOfProof.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}
        {worksAbout.length > 0 && node.kind === "media" && (
          <Section label={T.workAbout} icon={iconFor("Target")}>
            {worksAbout.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}
        {issuersOfProof.length > 0 && (
          <Section label={T.issuedBy} icon={iconFor("Building2")}>
            {issuersOfProof.map((n) => (
              <NodeChip key={n.id} node={n} lang={lang} onClick={jumpToId} />
            ))}
          </Section>
        )}

        {/* PROOF EXTRAS: publication, quote, asset ---------------------- */}
        {(node.publication || node.publication_date) && (
          <Section label={T.publication} icon={iconFor("Newspaper")}>
            <span className="text-[11px] font-mono text-txt-muted px-2 py-1 ring-1 ring-border/40">
              {[node.publication, node.publication_date].filter(Boolean).join(" · ")}
            </span>
          </Section>
        )}
        {node.quote && (node.quote.en || node.quote.ru) && (
          <Section label={T.quote} icon={iconFor("Quote")}>
            <blockquote className="text-[12px] italic text-txt-muted border-l-2 border-border-dim pl-3 leading-relaxed">
              «{node.quote[lang] || node.quote.en || node.quote.ru}»
            </blockquote>
          </Section>
        )}
        {node.kind === "proof" && node.asset && (() => {
          const DocIcon = iconFor("Image");
          return (
            <Section label={lang === "ru" ? "Документ" : "Document"} icon={DocIcon}>
              <button
                type="button"
                onClick={() => {
                  const url = node.asset!;
                  openLightbox({
                    id: `${node.id}-asset`,
                    title: node.title,
                    shortTitle: node.shortTitle,
                    description: { en: "", ru: "" },
                    type: "media",
                    mediaUrl: url,
                    imageUrl: url,
                    mediaType: "image",
                    visible: true,
                  });
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-border/40 text-[11px] font-mono text-accent/80 hover:bg-accent/10 transition-colors"
              >
                <DocIcon className="w-3 h-3" strokeWidth={1.5} />
                {lang === "ru" ? "Открыть скан" : "Open scan"}
              </button>
            </Section>
          );
        })()}

        {/* WEBSITE (organizer) ------------------------------------------ */}
        {node.website && (
          <Section label={T.website} icon={Globe}>
            <a
              href={node.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-border/40 text-[11px] font-mono text-accent/80 hover:bg-accent/10 transition-colors"
            >
              <Globe className="w-3 h-3" strokeWidth={1.5} />
              {node.website.replace(/^https?:\/\//, "")}
            </a>
          </Section>
        )}

        {/* MEDIA ASSETS -------------------------------------------------- */}
        {prov.media.length > 0 && (() => {
          const FilmIcon = iconFor("Film");
          return (
            <Section label={T.media} icon={FilmIcon}>
              {prov.media.map(({ id, asset }) => {
                const meta = subkindMeta("media", asset.subkind);
                const Icon = iconFor(meta.icon);
                const mirrors = asset.mirrors ? Object.entries(asset.mirrors) : [];
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 ring-1 ring-border/40 text-[11px] font-mono text-txt-muted"
                    title={asset.title?.[lang] || id}
                  >
                    <Icon className="w-3 h-3" strokeWidth={1.5} />
                    {asset.title?.[lang] || id}
                    {mirrors.length > 0 && (
                      <span className="text-txt-dim opacity-70 ml-1">
                        ·{" "}
                        {mirrors.map(([platform, url], i) => (
                          <React.Fragment key={platform}>
                            {i > 0 && " · "}
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent transition-colors uppercase"
                            >
                              {platform}
                            </a>
                          </React.Fragment>
                        ))}
                      </span>
                    )}
                  </span>
                );
              })}
            </Section>
          );
        })()}

        {/* ATTENDANCE (events) ------------------------------------------ */}
        {hasStats && (
          <Section label={T.attendance} icon={Users}>
            <div className="flex gap-8">
              {typeof node.attendance?.visitors === "number" && (
                <Stat label={T.visitors} value={node.attendance.visitors} />
              )}
              {typeof node.attendance?.contacts === "number" && (
                <Stat label={T.contacts} value={node.attendance.contacts} />
              )}
            </div>
          </Section>
        )}
      </div>
    </section>
  );
};
