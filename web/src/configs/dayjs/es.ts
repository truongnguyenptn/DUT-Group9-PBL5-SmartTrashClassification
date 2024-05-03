// Spanish [es]
import dayjs from 'dayjs';

const locale = {
  formats: {
    ['L']: 'DD/MM/YYYY',
    ['LL']: 'D [de] MMMM [de] YYYY',
    ['LLL']: 'D [de] MMMM [de] YYYY H:mm',
    ['LLLL']: 'dddd, D [de] MMMM [de] YYYY H:mm',
    ['LT']: 'H:mm',
    ['LTS']: 'H:mm:ss',
  },
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_',
    ),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  name: 'es',
  ordinal: (n: number) => {
    const o = n === 1 ? 'er' : '';
    return `${n}${o}`;
  },
  relativeTime: {
    ['M']: 'un mes',
    ['MM']: '%d meses',
    d: 'un día',
    dd: '%d días',
    future: 'en %s',
    h: 'una hora',
    hh: '%d horas',
    m: 'un minuto',
    mm: '%d minutos',
    past: 'hace %s',
    s: 'unos segundos',
    y: 'un año',
    yy: '%d años',
  },
  weekStart: 1,
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
};

dayjs.locale(locale, undefined, true);

export default locale;
