import type { HeroVisual, Media, Work, CaseEvent } from '../data/site';
interface HeroClip {
  id: string;
  mediaId: string;
  target: HeroVisual['target'];
}
interface HeroSource {
  media: Pick<Media, 'id' | 'rights' | 'previewSrc' | 'poster'>[];
  works: Pick<Work, 'id' | 'media'>[];
  methods: { id: string; media: string[] }[];
  cases: Pick<CaseEvent, 'id' | 'work' | 'relatedWorks' | 'media' | 'participationStatus'>[];
  heroVisuals: HeroClip[];
}
/** Build from the PUBLIC projection, including its rights gates. Curated rows are contextual hints, not a limit. */
export function buildHeroLibrary(source: HeroSource): HeroClip[] {
  return source.media.flatMap((media) => {
    if (media.rights !== 'cleared' || !media.previewSrc?.startsWith('/') || !media.poster?.startsWith('/'))
      return [];
    const hint = source.heroVisuals.find((row) => row.mediaId === media.id);
    if (hint && hint.target.kind !== 'unmapped') return [hint];
    const work =
      source.works.find((work) => work.media.includes(media.id)) ??
      source.works.find((work) =>
        source.cases.some(
          (event) =>
            event.media.includes(media.id) &&
            event.participationStatus === 'held' &&
            (event.work === work.id || event.relatedWorks?.includes(work.id)),
        ),
      );
    if (work)
      return [
        { id: 'library-' + media.id, mediaId: media.id, target: { kind: 'work' as const, workId: work.id } },
      ];
    const method = source.methods.find((method) => method.media.includes(media.id));
    return method
      ? [
          {
            id: 'library-' + media.id,
            mediaId: media.id,
            target: { kind: 'method' as const, methodId: method.id },
          },
        ]
      : [];
  });
}
