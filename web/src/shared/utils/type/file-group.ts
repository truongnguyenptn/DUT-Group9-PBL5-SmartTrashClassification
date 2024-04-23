import type { TranslationKeys } from '#/generated/translationKeys';

export enum FileGroupType {
  Media = 'Media',
  Files = 'Files',
  Links = 'Links',
}

export interface FileGroup {
  type: FileGroupType;
  title: TranslationKeys;
  element: JSX.Element;
}

export interface FileType {
  createdAt: string;
  fileName: string;
  fileSize: number | null;
  getMessageFileLoading: boolean;
  senderName: string;
  url: string;
  isFileLink?: boolean;
}
