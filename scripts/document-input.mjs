/** The same public editorial facts feed the overview PDF and its freshness check. */
export function technicalOverviewInput(source, asOf) {
  const ids = ['mindshow-installation', 'neurobattle-game', 'talk-workshop'];
  const cooperation = source.cooperationPages.find((row) => row.id === 'cooperation');
  if (!cooperation) throw Error('Technical overview requires cooperation');
  return {
    asOf,
    formats: ids.map((id) => {
      const row = source.formats.find((item) => item.id === id);
      if (!row) throw Error(`Technical overview requires format ${id}`);
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
