import { TranslationKeys } from '#/generated/translationKeys';

const PREFIX_SECTION = '/section';

interface PathProps {
  headerClass: string;
  path: string;
  title: TranslationKeys;
  statusLegendVisible?: boolean;
}

export const PATHS: Record<string, PathProps> = {
  ['contacts']: {
    headerClass: 'bg-gray-100',
    path: `${PREFIX_SECTION}/contacts`,
    title: 'section.contacts',
  },
  ['documents']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/documents`,
    title: 'section.documents',
  },
  ['formalities']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/formalities`,
    statusLegendVisible: true,
    title: 'section.formalities',
  },
  ['funeral']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/funeralService`,
    statusLegendVisible: true,
    title: 'section.funeralService',
  },
  ['rmr']: {
    headerClass: 'bg-white',
    path: `${PREFIX_SECTION}/funeralService`,
    statusLegendVisible: true,
    title: 'section.transportation',
  },
};
