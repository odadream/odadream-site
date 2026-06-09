/**
 * Normalize registry dates for Obsidian (Date property) and site display.
 * Storage format in engagement notes: YYYY-MM-DD (ISO, Obsidian-friendly).
 * Site tables use YYYY.MM.DD via formatRegistryDateForSite().
 */

export function normalizeRegistryDate(value) {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const dt = new Date(value);
    if (!Number.isNaN(dt.getTime())) return normalizeRegistryDate(dt);
  }

  const s = String(value).trim();

  const dotted = s.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})/);
  if (dotted) {
    return `${dotted[1]}-${dotted[2].padStart(2, "0")}-${dotted[3].padStart(2, "0")}`;
  }

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  }

  // Broken slice fallback: "Wed Jan 01" etc. — try Date.parse
  if (/^[A-Za-z]{3}\s/.test(s)) {
    const parsed = new Date(s);
    if (!Number.isNaN(parsed.getTime())) return normalizeRegistryDate(parsed);
    return "";
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) return normalizeRegistryDate(parsed);

  return "";
}

export function formatRegistryDateForSite(isoDate) {
  const norm = normalizeRegistryDate(isoDate);
  if (!norm) return "—";
  return norm.replace(/-/g, ".");
}

export function isBrokenRegistryDate(value) {
  const s = String(value ?? "").trim();
  if (!s) return false;
  if (value instanceof Date) return false;
  if (/^\d{4}[-.]\d{2}[-.]\d{2}/.test(s)) return false;
  if (/^[A-Za-z]{3}\s/.test(s)) return true;
  return !normalizeRegistryDate(value);
}
