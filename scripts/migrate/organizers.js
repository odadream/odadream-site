// Mark all org-*.md with kind=organizer + subkind.
// Source: organizations.yaml `kind` field (client|venue|institution|partner)
//   + ID-pattern hints for finer subkind (e.g. mipt → university, cipr → gov).

import { listContentFiles, readMd, writeMd, readYaml, log } from "./lib.js";

const YAML_TO_SUB = {
  client: "corporate",
  venue: "venue",
  institution: "university",
  partner: "corporate",
};

// Specific id hints override YAML kind for finer-grained subkind.
const ID_HINT = {
  mipt: "university", hse: "university", bauman: "university",
  skolkovo: "venue",
  cipr: "gov", moscow2030: "gov", "culture-sport": "gov",
  cci: "gov", tavrida: "gov", tsiolkovsky: "gov",
  ekoniva: "corporate", tbank: "corporate", sberbank: "corporate",
  lamborghini: "corporate", audi: "corporate", merck: "corporate",
  wildmint: "corporate", inforce: "corporate", neiry: "corporate",
  ashram: "corporate",
  kalashnikova: "curator", kapitsa: "curator",
};

function subkindFor(id, yamlKind) {
  for (const [hint, sk] of Object.entries(ID_HINT)) {
    if (id.includes(hint)) return sk;
  }
  return YAML_TO_SUB[yamlKind] ?? "corporate";
}

export function runOrganizers({ dryRun }) {
  const orgs = readYaml("organizations.yaml") ?? [];
  const yamlMap = new Map(orgs.map((o) => [o.id, o]));

  let updated = 0, skipped = 0;
  for (const { file, path: p } of listContentFiles()) {
    const md = readMd(p);
    const id = md?.fm?.id;
    if (!id?.startsWith("org-")) continue;
    if (md.fm.kind) { skipped++; continue; }

    const yamlKind = yamlMap.get(id)?.kind;
    const subkind = subkindFor(id, yamlKind);

    md.fm.kind = "organizer";
    md.fm.subkind = subkind;
    writeMd(p, md.fm, md.body, { dryRun });
    updated++;
    log("ok", file, `→ organizer/${subkind}`);
  }
  return { name: "organizers", updated, skipped };
}
