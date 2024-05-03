import type {
  DayRange,
  DayValue,
} from '@amir04lm26/react-modern-calendar-date-picker';

export const isDayValue = (value: DayRange | DayValue): value is DayRange =>
  !!(value as DayRange).from;
