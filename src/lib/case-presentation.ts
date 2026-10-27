import type { CaseEvent, Lang } from '../data/site';
import type { EventGenre } from '../data/event-contexts';
export const eventGenres: EventGenre[] = [
  'festival',
  'conference',
  'forum',
  'exhibition',
  'school',
  'retreat',
  'competition',
  'lecture',
  'laboratory',
  'programme',
  'meeting',
  'unknown',
];
export const eventGenreLabels: Record<EventGenre, Record<Lang, string>> = {
  festival: { ru: 'Фестивали', en: 'Festivals' },
  conference: { ru: 'Конференции', en: 'Conferences' },
  forum: { ru: 'Форумы', en: 'Forums' },
  exhibition: { ru: 'Выставки', en: 'Exhibitions' },
  school: { ru: 'Школы', en: 'Schools' },
  retreat: { ru: 'Ретриты', en: 'Retreats' },
  competition: { ru: 'Конкурсы и олимпиады', en: 'Competitions' },
  lecture: { ru: 'Лекции', en: 'Lectures' },
  laboratory: { ru: 'Лаборатории', en: 'Laboratories' },
  programme: { ru: 'Программы и серии встреч', en: 'Programmes and recurring sessions' },
  meeting: { ru: 'Встречи и частные события', en: 'Meetings and private events' },
  unknown: { ru: 'Без категории', en: 'Uncategorized' },
};

export const caseTypeLabels = {
  performance: { ru: 'Перформанс', en: 'Performance' },
  presentation: { ru: 'Показ', en: 'Presentation' },
  'participatory-format': { ru: 'Партисипаторная программа', en: 'Participatory programme' },
  lecture: { ru: 'Лекция', en: 'Lecture' },
  discussion: { ru: 'Дискуссия', en: 'Discussion' },
  laboratory: { ru: 'Лаборатория', en: 'Laboratory' },
};
export const participationLabels = {
  held: { ru: 'Участие состоялось', en: 'Participation took place' },
  invited: { ru: 'Приглашение', en: 'Invitation' },
  submitted: { ru: 'Заявка подана', en: 'Application submitted' },
  declined: { ru: 'Заявка отклонена', en: 'Application declined' },
  planned: { ru: 'Анонс', en: 'Announced' },
  recorded: { ru: 'Архивная запись', en: 'Archival record' },
};
export const contextLabels = {
  public: { ru: 'Публичная программа', en: 'Public programme' },
  private: { ru: 'Частное событие', en: 'Private event' },
  laboratory: { ru: 'Внутренняя лаборатория', en: 'Internal laboratory' },
  application: { ru: 'Конкурсная заявка', en: 'Competition application' },
};
export const formatCaseDate = (
  item: Pick<CaseEvent, 'date' | 'dateEnd' | 'dateMeaning' | 'datePrecision'>,
  lang: Lang,
) => {
  const date = (value: string) =>
    value.length === 4
      ? value
      : new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'long',
          ...(value.length === 10 ? { day: 'numeric' as const } : {}),
        }).format(new Date(`${value.length === 7 ? value + '-01' : value}T00:00:00Z`));
  const period = item.dateEnd ? `${date(item.date)} — ${date(item.dateEnd)}` : date(item.date);
  const prefix =
    item.dateMeaning === 'series-start'
      ? lang === 'ru'
        ? 'С '
        : 'Since '
      : item.dateMeaning === 'reported-by'
        ? lang === 'ru'
          ? 'Описано к '
          : 'Reported by '
        : item.dateMeaning === 'event-window'
          ? lang === 'ru'
            ? 'Период события: '
            : 'Event window: '
          : '';
  return prefix + period;
};
