/** The same public editorial facts feed prepared PDFs and their freshness checks. */
export function technicalOverviewInput(source, asOf) {
  const ids = ['mindshow-installation', 'neurobattle-game', 'talk-workshop'];
  const cooperation = source.cooperationPages.find((row) => row.id === 'cooperation');
  if (!cooperation) throw Error('Technical overview requires cooperation');
  return {
    asOf,
    formats: ids.map((id) => {
      const row =
        id === 'talk-workshop'
          ? source.educationOverview
          : source.configurations.find((item) => item.id === id);
      if (!row) throw Error(`Technical overview requires participation record ${id}`);
      return Object.fromEntries(
        ['id', 'title', 'participation', 'conditions', 'studioProvides', 'venueProvides'].map((key) => [
          key,
          row[key],
        ]),
      );
    }),
    studioProvides: cooperation.studioProvides,
    venueProvides: cooperation.venueProvides,
    briefFields: cooperation.briefFields,
  };
}

/** A CV uses personal roles and a clearly attributed selection of studio works. */
export function cvInput(source, document) {
  const person = source.people.find((row) => row.id === document.personId);
  if (!person?.biography || !person.cv) throw Error(`CV requires prepared person ${document.personId}`);
  return {
    asOf: document.asOf,
    person: {
      ...Object.fromEntries(['id', 'name', 'role', 'biography'].map((key) => [key, person[key]])),
      cv: {
        sections: person.cv.sections.map((row) =>
          Object.fromEntries(['id', 'title', 'body'].map((key) => [key, row[key]])),
        ),
        base: person.cv.base,
        workIds: person.cv.workIds,
        caseIds: person.cv.caseIds,
      },
    },
    works: person.cv.workIds.map((id) => {
      const row = source.works.find((item) => item.id === id);
      if (!row) throw Error(`CV requires work ${id}`);
      return Object.fromEntries(['id', 'slug', 'title', 'year', 'stage'].map((key) => [key, row[key]]));
    }),
    cases: person.cv.caseIds.map((id) => {
      const row = source.cases.find((item) => item.id === id);
      if (!row) throw Error(`CV requires case ${id}`);
      return Object.fromEntries(
        ['id', 'slug', 'title', 'date', 'datePrecision', 'place', 'role', 'detailPage'].map((key) => [
          key,
          row[key],
        ]),
      );
    }),
  };
}
