import dayjs, { Dayjs } from 'dayjs';
import type { DayValue } from '@amir04lm26/react-modern-calendar-date-picker';
import i18n from '../i18n';
import {
  DATE_OF_BEFORE_YEAR_FORMAT,
  DATE_FORMAT,
  DATE_OF_CURRENT_YEAR_FORMAT,
} from '#/shared/utils/constant';

export const constructDayjsFromDayValue = (date: DayValue) =>
  dayjs.utc(`${date?.year}-${date?.month}-${date?.day}`);

export const constructDayValueFromDayjs = (date: Dayjs): DayValue => ({
  day: date.utc().date(),
  month: date.utc().month() + 1,
  year: date.utc().year(),
});

export const formatDateInput = (date?: DayValue) => {
  if (date) {
    const { day, month, year } = date;

    return dayjs(`${year}-${month}-${day}`).format(DATE_FORMAT).toString();
  }
  return '';
};
export const formatDateWithHour = (
  date: string | number,
  formatter = '',
): string => {
  let hourFormatString;
  const locale = localStorage.getItem('locale') || 'fr';

  switch (locale) {
    case 'es':
      dayjs.locale('es-do');
      hourFormatString = `${formatter} [a las] HH:mm`;
      break;
    case 'fr':
      dayjs.locale('fr');
      hourFormatString = `${formatter} [à] HH:mm`;
      break;
    default:
      dayjs.locale('en');
      hourFormatString = `${formatter} [at] HH:mm`;
  }
  return dayjs(date).locale(locale).format(hourFormatString);
};

export function formatMessageDate(
  date: string | number,
  formatterCurrentYear = DATE_OF_CURRENT_YEAR_FORMAT.shortMonth,
  formatterBeforeYear = DATE_OF_BEFORE_YEAR_FORMAT.shortMonth,
): string {
  if (dayjs(date).isToday())
    return formatDateWithHour(date, `[${i18n.t('chat.today')}]`);
  if (dayjs(date).year() < dayjs().year())
    return formatDateWithHour(date, formatterBeforeYear);
  return formatDateWithHour(date, formatterCurrentYear);
}

export const formatDate = (date: dayjs.ConfigType, formatter: string) => {
  const locale = localStorage.getItem('locale') || 'fr';

  return date ? dayjs(date).locale(locale).format(formatter) : '';
};
