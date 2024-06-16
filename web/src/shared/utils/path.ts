
const PREFIX_SECTION = '/section';

interface PathProps {
  headerClass: string;
  path: string;
  title: string;
  statusLegendVisible?: boolean;
}

export const PATHS: Record<string, PathProps> = {
  ['HOM']: {
    headerClass: 'bg-gray-100',
    path: `home`,
    title: 'Home',
  },
  ['documents']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/documents`,
    title: 'section.documents',
  },
  ['formalities']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/formalities`,
    statusLegendVisible: false,
    title: 'section.formalities',
  },
  ['funeral']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/funeralService`,
    statusLegendVisible: false,
    title: 'section.funeralService',
  },
  ['rmr']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/funeralService`,
    statusLegendVisible: false,
    title: 'section.transportation',
  },
};
