import { vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import { MOCK_GOOGLE_MAP } from './src/tests/mocks/GoogleMap';
import './src/configs/index';

vi.mock('@react-google-maps/api', async () => {
  const actual: Record<string, string> = await vi.importActual(
    '@react-google-maps/api',
  );

  return {
    ...actual,
    MarkerClustererF: vi.fn(),
    PolylineF: vi.fn(),
  };
});

window.google = {
  maps: MOCK_GOOGLE_MAP as any,
};

// Config Dayjs

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(updateLocale);

expect.extend(matchers);

// mock i18next

vi.mock('react-i18next', async () => {
  const originalModule: Record<string, string> = await vi.importActual(
    'react-i18next',
  );

  return {
    ['__esModule']: true,
    ...originalModule,
    useTranslation: () => ({
      i18n: {
        changeLanguage: () => new Promise(vi.fn()),
      },
      t: str => str,
    }),
  };
});

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };

const windowMock = {
  scrollTo: vi.fn(),
  location: {
    ...window.location,
    host: 'localhost',
  },
};

Object.assign(global, global, windowMock);
