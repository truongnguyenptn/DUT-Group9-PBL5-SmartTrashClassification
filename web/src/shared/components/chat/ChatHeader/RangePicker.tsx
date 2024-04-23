import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import { Calendar } from '@amir04lm26/react-modern-calendar-date-picker';
import { ConfigProvider, Input, InputProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useToggle } from '@enouvo/react-hooks';
import type {
  DayRange,
  DayValue,
  CalendarProps,
  Day,
  Locale,
} from '@amir04lm26/react-modern-calendar-date-picker';
import { Dayjs } from 'dayjs';
import { twMerge } from 'tailwind-merge';
import useClickOutside from '#/shared/hooks/useClickOutside';
import { ReactComponent as ArrowRightOutlineSVG } from '#/assets/svgs/arrow-right-outline.svg';
import { ReactComponent as CalendarOutlineSVG } from '#/assets/svgs/calendar-outline.svg';
import { ReactComponent as CloseCircleFilledSVG } from '#/assets/svgs/close-circle-filled.svg';
import { isDayValue } from '#/shared/utils/type/type-guard';
import {
  constructDayjsFromDayValue,
  constructDayValueFromDayjs,
  formatDateInput,
} from '#/shared/utils/date';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

function RangePickerInput({ ...rest }: InputProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          ['Input']: {
            colorBgBase: 'transparent',
            colorBgContainer: 'transparent',
            colorTextPlaceholder: 'var(--grey-primary-300)',
            controlOutline: 'none',
            controlOutlineWidth: 0,
          },
        },
      }}
    >
      <Input
        className="h-6 border-none outline-none placeholder:font-normal"
        {...rest}
      />
    </ConfigProvider>
  );
}

interface RangePickerProps {
  value?: [Dayjs, Dayjs];
  onChange?: (value?: [Dayjs, Dayjs]) => void;
  onClear?: () => void;
}

export default function RangePicker<
  TValue extends DayValue | Day[] | DayRange,
>({
  onChange,
  value,
  onClear,
  ...rest
}: RangePickerProps & Omit<CalendarProps<TValue>, 'value' | 'onChange'>) {
  const { t } = useTypeSafeTranslation();
  const [calendarVisible, onOpen, onClose, onToggle] = useToggle(false);
  const [clearBtnVisible, onShowClearBtn, onHideClearBtn] = useToggle(false);
  const [dayRange, setDayRange] = useState<DayRange>({
    from: undefined,
    to: undefined,
  });
  const datePickerContainer = useRef(null);

  useClickOutside({
    onClickOutside: onClose,
    ref: datePickerContainer,
  });

  const customLocale: Locale = {
    closeMonthSelector: t('rangePicker.closeMonthSelector'),
    closeYearSelector: t('rangePicker.closeYearSelector'),
    defaultPlaceholder: t('rangePicker.defaultPlaceholder'),
    digitSeparator: ',',
    from: t('rangePicker.from'),
    getMonthLength(date: Day) {
      return new Date(date.year, date.month, 0).getDate();
    },
    getToday(gregorainTodayObject: Day) {
      return gregorainTodayObject;
    },
    isRtl: false,
    months: [
      t('rangePicker.jan'),
      t('rangePicker.feb'),
      t('rangePicker.mar'),
      t('rangePicker.apr'),
      t('rangePicker.may'),
      t('rangePicker.jun'),
      t('rangePicker.jul'),
      t('rangePicker.aug'),
      t('rangePicker.sep'),
      t('rangePicker.oct'),
      t('rangePicker.nov'),
      t('rangePicker.dec'),
    ],
    nextMonth: t('rangePicker.nextMonth'),
    openMonthSelector: t('rangePicker.openMonthSelector'),
    openYearSelector: t('rangePicker.openYearSelector'),
    previousMonth: t('rangePicker.previousMonth'),
    to: t('rangePicker.to'),
    toNativeDate(date: Day) {
      return new Date(date.year, date.month - 1, date.day);
    },
    transformDigit(digit: string | number) {
      return digit;
    },
    weekDays: [
      {
        isWeekend: true,
        name: t('rangePicker.weekDays.sun.fullName'),
        short: t('rangePicker.weekDays.sun.shortName'),
      },
      {
        name: t('rangePicker.weekDays.mon.fullName'),
        short: t('rangePicker.weekDays.mon.shortName'),
      },
      {
        name: t('rangePicker.weekDays.tues.fullName'),
        short: t('rangePicker.weekDays.tues.shortName'),
      },
      {
        name: t('rangePicker.weekDays.wed.fullName'),
        short: t('rangePicker.weekDays.wed.shortName'),
      },
      {
        name: t('rangePicker.weekDays.thur.fullName'),
        short: t('rangePicker.weekDays.thur.shortName'),
      },
      {
        name: t('rangePicker.weekDays.fri.fullName'),
        short: t('rangePicker.weekDays.fri.shortName'),
      },
      {
        isWeekend: true,
        name: t('rangePicker.weekDays.sat.fullName'),
        short: t('rangePicker.weekDays.sat.shortName'),
      },
    ],
    weekStartingIndex: 0,
    yearLetterSkip: 0,
  };

  useEffect(() => {
    if (value) {
      setDayRange({
        from: constructDayValueFromDayjs(value[0]),
        to: constructDayValueFromDayjs(value[1]),
      });
    }
  }, [value]);

  const onChangeDateRange = (date: DayRange | DayValue) => {
    if (isDayValue(date)) {
      if (dayRange.from && dayRange.to) {
        // when complete select both start and end date
        setDayRange({
          from: date.from,
          to: undefined,
        });
        return;
      }
      // when start date is not selected
      if (!dayRange.from) {
        setDayRange({
          from: date.from,
          to: undefined,
        });
        return;
      }
      // select end date and close calendar
      setDayRange({
        from: date.from,
        to: date.to,
      });
      onChange?.([
        constructDayjsFromDayValue(date.from),
        constructDayjsFromDayValue(date.to),
      ]);
      onClose();
    } else {
      // if date type is DayValue then we will set the start date first
      setDayRange({
        from: date,
        to: undefined,
      });
    }
  };

  const onClearDate = () => {
    setDayRange({ from: undefined, to: undefined });
    onChange?.(undefined);
    onClear?.();
  };

  return (
    <>
      <div className="relative flex" ref={datePickerContainer}>
        <div
          className={twMerge(
            'box-border flex w-full items-center rounded-lg bg-grey-filter py-2 transition-shadow ease-out',
            calendarVisible && 'shadow-input-active',
          )}
          onMouseLeave={onHideClearBtn}
          onMouseOver={onShowClearBtn}
        >
          <RangePickerInput
            onClick={onOpen}
            placeholder={t('placeholder.startDate')}
            readOnly
            value={formatDateInput(dayRange.from)}
          />
          <span className="text-grey-primary-300">
            <ArrowRightOutlineSVG height={16} width={16} />
          </span>
          <RangePickerInput
            onClick={onOpen}
            placeholder={t('placeholder.endDate')}
            readOnly
            value={formatDateInput(dayRange.to)}
          />
          <div className="absolute right-0 mr-[0.625rem] text-grey-primary-300">
            {clearBtnVisible && (dayRange.from || dayRange.to) ? (
              <CloseCircleFilledSVG
                className="cursor-pointer"
                height={24}
                onClick={onClearDate}
                width={24}
              />
            ) : (
              <CalendarOutlineSVG
                className="cursor-pointer"
                height={24}
                onClick={onToggle}
                width={24}
              />
            )}
          </div>
        </div>
        <Calendar
          calendarClassName={twMerge(
            'fixed mt-12 opacity-0 transition-all duration-500 -z-50',
            calendarVisible ? 'opacity-1 z-50' : 'top-[100%]',
          )}
          colorPrimary="var(--primary-color)"
          colorPrimaryLight="#e7f4f4"
          locale={customLocale}
          onChange={onChangeDateRange}
          value={dayRange}
          {...rest}
        />
      </div>
    </>
  );
}
