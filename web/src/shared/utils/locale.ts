export const LOCALE_KEY = 'locale';

export const setLocale = (locale: string) => {
  localStorage.setItem(LOCALE_KEY, locale);
};

export const clearLocale = () => localStorage.removeItem(LOCALE_KEY);

export const getLocale = () => localStorage.getItem(LOCALE_KEY) ?? 'fr';
