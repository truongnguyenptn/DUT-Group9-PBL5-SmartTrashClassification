import loadable from '@loadable/component';
import type { Section } from './type/shared';
import { SectionId } from './type/shared';
import type { FileGroup } from './type/file-group';
import { FileGroupType } from './type/file-group';
import { ReactComponent as CustomerSupportFilledSVG } from '#/assets/svgs//customer-support-filled.svg';
import { ReactComponent as FormalitiesFilledSVG } from '#/assets/svgs/formalities-filled.svg';
import { ReactComponent as FuneralServiceFilledSVG } from '#/assets/svgs/funeral-service-filled.svg';
import { ReactComponent as PlaneFilledSVG } from '#/assets/svgs/plane-filled.svg';
import { ReactComponent as NavbarDocumentFilledSVG } from '#/assets/svgs/navbar-document-filled.svg';
import { TranslationKeys } from '#/generated/translationKeys';
import { TrackingDriverStatus } from '#/generated/schemas';

const Media = loadable(
  () => import('#/shared/components/chat/FileGroupDrawer/Media'),
);

const Files = loadable(
  () => import('#/shared/components/chat/FileGroupDrawer/Files'),
);

const Link = loadable(
  () => import('#/shared/components/chat/FileGroupDrawer/Links'),
);

export const DEFAULT_PAGE_SIZE = 30;
export const MAX_IMAGE_FILE = 15;
export const NAME_LENGTH = 15;
export const FILE_NAME_LENGTH = 40;
export const IMAGE_LIMIT = 18;
export const PUBLIC_COUNTRY_API_URL = 'https://countries.trevorblades.com/';
export const sections: Section[] = [
  {
    description: 'section.contactsDescription',
    icon: <CustomerSupportFilledSVG />,
    id: SectionId.Contacts,
    title: 'section.contacts',
    to: `/section/${SectionId.Contacts}`,
  },
  {
    description: 'section.caseDetailDescription',
    icon: <NavbarDocumentFilledSVG />,
    id: SectionId.Documents,
    title: 'section.documents',
    to: `/section/${SectionId.Documents}`,
  },
  {
    description: 'section.formalitiesDescription',
    icon: <FormalitiesFilledSVG />,
    id: SectionId.Formalities,
    title: 'section.formalities',
    to: `/section/${SectionId.Formalities}`,
  },
  {
    description: 'section.transportationDescription',
    icon: <PlaneFilledSVG />,
    id: SectionId.Transportation,
    title: 'section.transportation',
    to: `/section/${SectionId.Transportation}`,
  },
  {
    description: 'section.funeralServiceDescription',
    icon: <FuneralServiceFilledSVG />,
    id: SectionId.FuneralService,
    title: 'section.funeralService',
    to: `/section/${SectionId.FuneralService}`,
  },
];

export const TERRA_NAME = 'Terra';
export const HASH_VALUE = '#message';
export const CHANGE_STATUS_HASH_VALUE = '#change-status';
export const TRACK_DRIVER_HASH_VALUE = '#track-driver';
export const SHARE_LINK_HASH_VALUE = '#share-link';

export const FILE_GROUP_SEARCH_PARAM_KEY = 'file-group';
export const IMAGE_TYPE = 'image/jpeg,image/png,image/jpg,image/webp';
export const IMAGE_TYPE_URL = 'jpeg,png,jpg,webp';

export const DEFAULT_UPLOAD_TYPE =
  'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/csv,image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/quicktime,audio/mpeg,audio/wav,audio/webm,text/csv,video/webm,text/plain';
export const REFETCH_MESSAGE_INTERVAL_TIME = 5 * 1000;
export const REFETCH_GET_ME_INTERVAL_TIME = 5 * 1000;
export const DEFAULT_PAGE = 1;
export const DATETIME_FORMAT = 'DD/MM/YYYY - HH:mm';
export const DATE_FORMAT_FULL = 'ddd DD MMM YYYY';
export const DATE_FORMAT = 'DD MMM YYYY';
export const FRANCE_TIMEZONE = 'Europe/Paris';
export const DATE_OF_BEFORE_YEAR_FORMAT = {
  fullMonth: 'DD MMMM YYYY',
  shortMonth: 'DD MMM YYYY',
};
export const DATE_OF_CURRENT_YEAR_FORMAT = {
  fullMonth: 'DD MMMM',
  shortMonth: 'DD MMM',
};

export const IS_XS_SCREEN = window.innerWidth <= 576;
export const IS_MD_SCREEN = window.innerWidth <= 768;

export const PATH_URL = {
  contact: 'section/contacts',
  documents: '/section/documents',
  formalities: '/section/formalities',
  funeralService: '/section/funeral-service',
  home: '/',
  login: '/login',
  section: '/section',
  transportation: '/section/transportation',
};

export const VideoType = {
  mp4: 'video/mp4',
  quicktime: 'video/quicktime',
};

export const PDF_MIME_TYPE = ['pdf'];
export const WORD_MIME_TYPE = ['doc', 'docx'];
export const EXCEL_MIME_TYPE = ['xls', 'xlsx', 'csv'];
export const AUDIO_MIME_FILE = ['wav', 'mp3'];

export const TERRA_PHONE_NUMBER = '';

export const HASH_MAP_VIEW = '#map-view';

export const HASH_MAP_DRIVER_VIEW = '#map-driver-view';

export const FILE_GROUPS: FileGroup[] = [
  {
    element: <Media />,
    title: 'fileGroup.media',
    type: FileGroupType.Media,
  },
  {
    element: <Files />,
    title: 'fileGroup.files',
    type: FileGroupType.Files,
  },
  {
    element: <Link />,
    title: 'fileGroup.links',
    type: FileGroupType.Links,
  },
];

export const MAX_MEDIA_FILE = 30;

export const KEY_GROUP_FILE = {
  file: 'File',
  link: 'Link',
  media: 'Media',
};

export const STATUS: {
  status: number;
  bg: string;
  title: TranslationKeys;
  color: string;
  value: TrackingDriverStatus;
}[] = [
  {
    bg: 'bg-warning-light',
    color: 'text-orange-500',
    status: 1,
    title: 'statusLegend.plan',
    value: TrackingDriverStatus.Planned,
  },
  {
    bg: 'bg-sky-100',
    color: 'text-teal',
    status: 2,
    title: 'statusLegend.confirm',
    value: TrackingDriverStatus.Confirmed,
  },
  {
    bg: 'bg-sky-200',
    color: 'text-blue-600',
    status: 6,
    title: 'statusLegend.inprogress',
    value: TrackingDriverStatus.Inprogress,
  },
  {
    bg: 'bg-red-100',
    color: 'text-error',
    status: 3,
    title: 'statusLegend.postpone',
    value: TrackingDriverStatus.Postponed,
  },
  {
    bg: 'bg-slate-200',
    color: 'text-purple',
    status: 8,
    title: 'statusLegend.change',
    value: TrackingDriverStatus.Changed,
  },
  {
    bg: 'bg-success-light',
    color: 'text-lime-600',
    status: 5,
    title: 'statusLegend.finish',
    value: TrackingDriverStatus.Finished,
  },
  {
    bg: 'bg-gray-200',
    color: 'text-grey',
    status: 4,
    title: 'statusLegend.cancel',
    value: TrackingDriverStatus.Canceled,
  },
];
