import dayjs from 'dayjs';

const locale = {
  formats: {
    ['L']: 'DD/MM/YYYY',
    ['LL']: 'D MMMM YYYY',
    ['LLL']: 'D MMMM YYYY HH:mm',
    ['LLLL']: 'dddd D MMMM YYYY HH:mm',
    ['LT']: 'HH:mm',
    ['LTS']: 'HH:mm:ss',
  },
  months:
    'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
      '_',
    ),
  monthsShort: 'Janv_Févr_Mars_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc'.split(
    '_',
  ),
  name: 'fr',
  ordinal: (n: number) => {
    const o = n === 1 ? 'er' : '';
    return `${n}${o}`;
  },
  relativeTime: {
    ['M']: 'un mois',
    ['MM']: '%d mois',
    d: 'un jour',
    dd: '%d jours',
    future: 'dans %s',
    h: 'une heure',
    hh: '%d heures',
    m: 'une minute',
    mm: '%d minutes',
    past: 'il y a %s',
    s: 'quelques secondes',
    y: 'un an',
    yy: '%d ans',
  },
  weekStart: 1,
  weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
  yearStart: 4,
};

dayjs.locale(locale, undefined, true);

export default locale;
