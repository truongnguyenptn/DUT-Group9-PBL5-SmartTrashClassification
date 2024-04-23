import type { RcFile } from 'antd/es/upload';
import frFR from 'antd/es/locale/fr_FR';
import enUS from 'antd/es/locale/en_US';
import esES from 'antd/es/locale/es_ES';
import type { DeepPartial } from '@enouvo/react-uikit';
import type { Dayjs } from 'dayjs';
import * as Sentry from '@sentry/react';
import { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { FC, SVGProps } from 'react';
import type { Place } from './type/transportation';
import {
  ContactData,
  DocumentSectionType,
  DocumentStatus,
} from './type/contact';
import { DATETIME_FORMAT, FRANCE_TIMEZONE, IMAGE_TYPE } from './constant';
import { ReactComponent as AlertFilledSVG } from '#/assets/svgs/alert-filled.svg';
import { ReactComponent as CommentFilledSVG } from '#/assets/svgs/comment-filled.svg';
import { ReactComponent as DetailFilledSVG } from '#/assets/svgs/detail-filled.svg';
import { ReactComponent as DocumentsFilledSVG } from '#/assets/svgs/documents-filled.svg';
import { ReactComponent as FormFilledSVG } from '#/assets/svgs/form-filled.svg';
import { ReactComponent as HistoryFilledSVG } from '#/assets/svgs/history-filled.svg';
import { ReactComponent as LogisticFilledSVG } from '#/assets/svgs/logistic-filled.svg';
import { ReactComponent as PaymentFilledSVG } from '#/assets/svgs/payment-filled.svg';
import { ReactComponent as PhotoFilledSVG } from '#/assets/svgs/photo-filled.svg';
import { ReactComponent as PreviewFilledSVG } from '#/assets/svgs/preview-filled.svg';
import { ReactComponent as QuoteFilledSVG } from '#/assets/svgs/quote-filled.svg';
import { IInbox, Maybe, ReplyMessageType } from '#/generated/schemas';
import { TranslationKeys } from '#/generated/translationKeys';
import i18n from '#/shared/i18n';

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};
export const scrollToMap = () => {
  document.getElementById('map')?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
};
export const formatStartDate = (date: Dayjs) =>
  `${date.format('YYYY-MM-DD')}T00:00:00.000Z`;

export const formatEndDate = (date: Dayjs) =>
  `${date.format('YYYY-MM-DD')}T23:59:59.000Z`;

export const convertStringToUTC = (date: string) =>
  dayjs.tz(date, DATETIME_FORMAT, FRANCE_TIMEZONE).toDate();

export const getFileName = (url?: string) =>
  url?.split('/')?.pop()?.split(/-(.*)/)?.[1];

export const getDriverId = (link: string) => link.split('.com/')[1];

export const getFileNameFromUrl = (url?: string) => url?.split('/')?.pop();

export function truncateName(str: string, length: number) {
  if (str.length > length) {
    return `${str.substr(0, Math.round(length / 2))}...${str.substr(
      -Math.round(length / 2),
    )}`;
  }

  return str;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getUserName(inbox: DeepPartial<IInbox>) {
  return [
    inbox.civilityFamilyMember,
    inbox.firstNameFamilyMember,
    inbox.lastNameFamilyMember,
  ].join(' ');
}

export const scrollToMessageId = ({
  messageId,
  takeLatest,
  scrollOption,
}: {
  messageId?: string;
  scrollOption?: ScrollIntoViewOptions;
  takeLatest?: boolean;
}) => {
  if (messageId) {
    const elements = document.getElementsByClassName(messageId);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    elements[takeLatest ? elements.length - 1 : 0]?.scrollIntoView({
      ...scrollOption,
    });
  }
};

export const getConfigLocale = (language: string) => {
  switch (language) {
    case 'en': {
      return enUS;
    }
    case 'fr': {
      return frFR;
    }
    case 'es': {
      return esES;
    }
    default:
      return frFR;
  }
};

export function callNumber(phone: string): void {
  const link = document.createElement('a');
  link.href = `tel:${phone}`;
  link.click();
}

export const formatAddress = (address: Place | ContactData) =>
  `${[
    address.name || '',
    address.address || '',
    address.city || '',
    address.region || '',
    address.zipcode || '',
  ].join(' ')} - ${address.country}`;

interface GetSurroundMarkerPosition {
  index: number;
  totalPoints: number;
  center: {
    lat: number;
    lng: number;
  };
}

const RADIUS = 0.00006;

export const getSurroundMarkerPosition = ({
  center,
  index,
  totalPoints = 1,
}: GetSurroundMarkerPosition) => {
  const theta = (Math.PI * 2) / totalPoints;
  const angle = theta * (index - 0.5);

  return {
    lat: center.lat + RADIUS * Math.cos(angle),
    lng: center.lng + RADIUS * Math.sin(angle),
  };
};

export const getAddress = (place: Place) => {
  if (
    place.name ||
    place.address ||
    place.city ||
    place.region ||
    place.zipcode ||
    place.country
  ) {
    return `${place.name ? `${place.name}` : ''}${
      place.address ? `, ${place.address}` : ''
    }${place.zipcode ? `, ${place.zipcode}` : ''}
    ${place.city ? `${place.city}` : ''}${
      place.country ? `, ${place.country}` : ''
    }`;
  }

  return null;
};

export const sliceText = (text: string, length = 20) =>
  text.length > 20 ? `${text.slice(0, length)}...` : text;

export const logger = (error: unknown | string) => {
  const message = (() => {
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'object') {
      const { message } = error as Error;
      return message === 'Network Error' ? 'Bad Gateway' : message;
    }

    return `Internal Server Error. Please try later!`;
  })();

  Sentry.captureMessage(message);
};

export const getColorByStatus = (statusId: number) => {
  switch (statusId) {
    case 1:
      return {
        bg: 'bg-warning-light',
        indexBg: 'bg-orange-500',
        text: 'text-orange-500',
      };
    case 2:
      return {
        bg: 'bg-sky-100',
        indexBg: 'bg-teal',
        text: 'text-teal',
      };
    case 3:
      return {
        bg: 'bg-red-100',
        indexBg: 'bg-error',
        text: 'text-error',
      };
    case 4:
      return {
        bg: 'bg-gray-200',
        indexBg: 'bg-grey',
        text: 'text-grey',
      };
    case 5:
      return {
        bg: 'bg-success-light',
        indexBg: 'bg-lime-600',
        text: 'text-lime-600',
      };
    case 8:
      return {
        bg: 'bg-slate-200',
        indexBg: 'bg-purple',
        text: 'text-purple',
      };
    default:
      return {
        bg: 'bg-sky-200',
        indexBg: 'bg-blue-600',
        text: 'text-blue-600',
      };
  }
};
export const getNameByStatus = (statusId: number) => {
  switch (statusId) {
    case 1:
      return i18n.t('statusLegend.plan');
      break;
    case 2:
      return i18n.t('statusLegend.confirm');
      break;
    case 3:
      return i18n.t('statusLegend.postpone');
      break;
    case 4:
      return i18n.t('statusLegend.cancel');
      break;
    case 5:
      return i18n.t('statusLegend.finish');
      break;
    case 8:
      return i18n.t('statusLegend.change');
      break;
    default:
      return i18n.t('statusLegend.inprogress');
  }
};

export const isFile = (
  file: string | Blob | RcFile | File | ProgressEvent<FileReader>,
): file is File => typeof file === 'object';

export function isMedia(file: UploadFile) {
  if (IMAGE_TYPE.split(',').some(type => type === file.type)) {
    return true;
  }
  if (
    typeof file.type === 'string' &&
    file.type.includes('video') &&
    file.url
  ) {
    return true;
  }
  return false;
}

export const getFileTypeFromFileName = (name: string) =>
  String(name.split('.').slice(-1)[0].toLocaleLowerCase());

export const downLoadFile = async (url: string, name: string) => {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', name);
    link.click();
  } catch (error) {
    logger(error);
  }
};

export function truncateText(text: string, length = 20) {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export const getDocumentStatus = (
  statusText: string,
): {
  bg: string;
  color: string;
  title: DocumentStatus;
} => {
  switch (statusText) {
    case 'E/A / QR':
      return {
        bg: 'bg-rose-100',
        color: 'text-orange-500',
        title: DocumentStatus.Qr,
      };
    case 'E/A / SELECT':
      return {
        bg: 'bg-fuchsia-100',
        color: 'text-error',
        title: DocumentStatus.Select,
      };
    case 'E/A / REC':
      return {
        bg: 'bg-sky-100',
        color: 'text-teal',
        title: DocumentStatus.Rec,
      };
    case 'E/A / PAID':
      return {
        bg: 'bg-emerald-50',
        color: 'text-lime-600',
        title: DocumentStatus.Paid,
      };
    case 'E/A / BPA':
      return {
        bg: 'bg-yellow-50',
        color: 'text-purple',
        title: DocumentStatus.Bpa,
      };
    case 'E/A / GEST':
      return {
        bg: 'bg-orange-100',
        color: 'text-grey',
        title: DocumentStatus.Gest,
      };
    default:
      return {
        bg: 'bg-indigo-100',
        color: 'text-teal',
        title: DocumentStatus.Compta,
      };
  }
};

export const getDocumentSection = (
  sectionText: DocumentSectionType,
): {
  icon: FC<SVGProps<SVGSVGElement>>;
  title: TranslationKeys;
} => {
  switch (sectionText) {
    case 'form':
      return {
        icon: FormFilledSVG,
        title: 'documentSections.form',
      };
    case 'tasks':
      return {
        icon: AlertFilledSVG,
        title: 'documentSections.alerts',
      };
    case 'comments':
      return {
        icon: CommentFilledSVG,
        title: 'documentSections.comments',
      };
    case 'detail':
      return {
        icon: DetailFilledSVG,
        title: 'documentSections.details',
      };
    case 'documents':
      return {
        icon: DocumentsFilledSVG,
        title: 'documentSections.documents',
      };
    case 'history':
      return {
        icon: HistoryFilledSVG,
        title: 'documentSections.history',
      };
    case 'logistics':
      return {
        icon: LogisticFilledSVG,
        title: 'documentSections.logistics',
      };
    case 'payment':
      return {
        icon: PaymentFilledSVG,
        title: 'documentSections.payment',
      };
    case 'photo':
      return {
        icon: PhotoFilledSVG,
        title: 'documentSections.photo',
      };
    case 'preview':
      return {
        icon: PreviewFilledSVG,
        title: 'documentSections.preview',
      };
    default:
      return {
        icon: QuoteFilledSVG,
        title: 'documentSections.quotes',
      };
  }
};
export interface ScrollToMessageOption {
  messageType?: Maybe<ReplyMessageType>;
  fileUrl?: Maybe<string>;
  messageId: string;
  behavior?: ScrollBehavior;
}

export const getChatMessageId = ({
  fileUrl,
  messageId,
  messageType,
}: Omit<ScrollToMessageOption, 'behavior'>): string => {
  switch (messageType) {
    case ReplyMessageType.File:
      return [messageId, messageType, fileUrl ?? ''].join('-');
    case ReplyMessageType.Image:
      return [messageId, messageType].join('-');
    case ReplyMessageType.Text:
      return [messageId, messageType].join('-');
    default:
      return messageId;
  }
};
export const scrollToMessage = ({
  behavior = 'smooth',
  fileUrl,
  messageId,
  messageType,
}: ScrollToMessageOption) => {
  const elementId = getChatMessageId({
    fileUrl,
    messageId,
    messageType,
  });
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove('animate-highlight');
    const highlightedElements = Array.from(
      document.getElementsByClassName('animate-highlight'),
    );
    highlightedElements.forEach(element =>
      element.classList.remove('animate-highlight'),
    );
    setTimeout(() => {
      element.classList.add('animate-highlight');
    }, 200);
    element.scrollIntoView({
      behavior,
      block: 'start',
      inline: 'nearest',
    });
  }
};
export const sanitizeText = (text: string | undefined): string | undefined =>
  text
    ?.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&#34;');

export const normalizeText = (text: string | undefined): string | undefined =>
  text
    ?.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, `"`);
