const fail = (message, path) => {
  throw new Error(`Invalid page hierarchy${path ? ` in ${path}` : ''}: ${message}`);
};

export function validatePageCodes(html, path = '') {
  const family = html.match(/data-page-family="([A-Z])"/)?.[1];
  if (!family) fail('missing data-page-family', path);
  const rawCodes = [...html.matchAll(/data-page-code="([^"]+)"/g)].map((match) => match[1]);
  if (!rawCodes.length) fail('no machine-readable page codes', path);

  const sections = new Set();
  const items = new Map();
  for (const code of rawCodes) {
    const match = code.match(/^([A-Z])\.(\d{2})(?:\.(\d{2}))?$/);
    if (!match) fail(`malformed code ${code}; expected F / 00 / 00`, path);
    const [, codeFamily, sectionText, itemText] = match;
    if (codeFamily !== family) fail(`${code} belongs to ${codeFamily}, page belongs to ${family}`, path);
    const section = Number(sectionText);
    sections.add(section);
    if (itemText) {
      const values = items.get(section) ?? new Set();
      values.add(Number(itemText));
      items.set(section, values);
    }
  }

  if (!sections.has(0)) fail(`missing page identity ${family} / 00`, path);
  const orderedSections = [...sections].sort((a, b) => a - b);
  orderedSections.forEach((value, index) => {
    if (value !== index) fail(`section sequence skips ${String(index).padStart(2, '0')}`, path);
  });
  for (const [section, values] of items) {
    const orderedItems = [...values].sort((a, b) => a - b);
    orderedItems.forEach((value, index) => {
      if (value !== index + 1)
        fail(
          `item sequence in ${family} / ${String(section).padStart(2, '0')} skips ${String(index + 1).padStart(2, '0')}`,
          path,
        );
    });
  }
  return { family, sections: orderedSections.length, codes: rawCodes.length };
}
