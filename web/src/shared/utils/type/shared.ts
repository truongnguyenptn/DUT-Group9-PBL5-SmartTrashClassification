import { Display } from './common';
import type { ServiceType } from './services';
import type { TranslationKeys } from '#/generated/translationKeys';

export enum Platform {
  Admin = 'admin',
  Client = 'client',
}

export interface Section {
  to?: string;
  icon?: JSX.Element;
  title?: TranslationKeys;
  description?: TranslationKeys;
  id: SectionId | keyof Display;
}

export enum SectionId {
  Documents = 'documents',
  Contacts = 'contacts',
  Formalities = 'formalities',
  Transportation = 'rmr',
  FuneralService = 'funeral',
  Questions = 'questions',
}

export interface MarkerGroup extends ServiceType {
  index: number;
  children: (ServiceType & {
    index: number;
  })[];
}
