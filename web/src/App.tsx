import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

import weekday from 'dayjs/plugin/weekday';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import LoadingScreen from './shared/components/common/LoadingScreen';
import routes from '~react-pages';
import fr from '#/configs/dayjs/fr';
import es from '#/configs/dayjs/es';

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(timezone);
dayjs.extend(isToday);

dayjs.extend(updateLocale);
dayjs.updateLocale('es-do', es);
dayjs.updateLocale('fr', fr);

function App() {
  return <Suspense fallback={<LoadingScreen />}>{useRoutes(routes)}</Suspense>;
}

export default App;
