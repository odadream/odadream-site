import type { CaseEvent, Lang } from '../data/site';

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
  invited: { ru: 'Приглашение в архиве', en: 'Invitation recorded' },
  submitted: { ru: 'Заявка подана', en: 'Application submitted' },
  declined: { ru: 'Заявка отклонена', en: 'Application declined' },
  planned: { ru: 'План', en: 'Planned' },
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
