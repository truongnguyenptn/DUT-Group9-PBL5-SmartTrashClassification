import { TransportationMode } from './transportation';
import type { Display, Meta } from './common';
import { TrackingDriverStatus } from '#/generated/schemas';

export enum StatusName {
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
}

export interface SubItemServices {
  id?: number | null;
  name?: string | null;
  ['name_fr']?: string | null;
  ['name_en']?: string | null;
  ['name_es']?: string | null;
  ['type_ope']?: number | null;
  picture?: string | null;
  ['type_ope_name']?: string | null;
}

export interface SubItemPlaceServices {
  id?: number | null;
  name?: string | null;
  address?: string | null;
  address_complement?: string | null;
  city?: string | null;
  region?: string | null;
  zipcode?: string | null;
  country?: string | null;
  location?: string | null;
}

export interface ServicesDataFormatted {
  arrival?: SubItemServices | null;
  departure?: SubItemServices | null;
  number?: number | null;
  status?: number | null;
  statusName?: TrackingDriverStatus | null;
  name?: string | null;
  mode?: TransportationMode | null;
  id: number;
  ['date_started']?: string | null;
  ['last_updated']?: string | null;
  ['status_name']?: string | null;
  planning?: boolean | null;
  third?: boolean | null;
  step?: boolean | null;
  ['profession_prestation']?: SubItemServices | null;
  place?: SubItemPlaceServices | null;
}

export interface ServiceType {
  id?: number | null;
  address?: string | null;
  date?: string | null;
  image?: string | null;
  lat?: number | null;
  lng?: number | null;
  number?: number | null;
  placeId?: number | null;
  status?: string | null;
  statusId?: number | null;
  step?: boolean | null;
  title?: string | null;
  typeOpe?: number | null;
  mode?: TransportationMode | null;
}

export interface ServiceResponse {
  display: Display;
  meta: Meta;
  objects: ServicesDataFormatted[];
}

export interface StatusClassesProps {
  [id: string]: {
    bg: string;
    text: string;
  };
}
export interface GetServiceInput {
  email?: string | null;
  name?: string | null;
}
