import type { Display, Meta } from './common';
import type { TrackingDriver, TrackingDriverStatus } from '#/generated/schemas';

export interface TransportationFileType {
  id: string;
  name: string;
}

export enum TransportationMode {
  Transport = 'transport',
  Flight = 'flight',
  Service = 'service',
}

export enum StatusName {
  Confirmed = 'Confirmed',
  Rejected = 'Rejected',
}

export interface Place {
  address?: string | null;
  ['address_complement']?: unknown | null;
  city?: string | null;
  country?: string | null;
  id?: number | null;
  location?: string | null;
  name?: string | null;
  region?: string | null;
  ['zipcode']?: string | null;
}

export interface GoalType {
  date?: string | null;
  place?: Place | null;
}

export interface ObjectResponseType {
  arrival?: GoalType | null;
  departure?: GoalType | null;
  id?: number | null;
  identifier?: unknown | null;
  ['ind_lta']?: unknown | null;
  mode?: TransportationMode | null;
  status?: number | null;
  ['status_name']?: TrackingDriverStatus | null;
  type?: string | null;
}

export interface GetTransportationResponse {
  display: Display;
  meta: Meta;
  objects: ObjectResponseType[];
}

export interface SubItemTransport {
  place?: Place | null;
  address?: string | null;
  awb?: unknown | null;
  date?: string | null;
  flight?: unknown | null;
  lat?: number | null;
  lng?: number | null;
  number?: number | null;
  placeId?: number | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GetTransportationFormattedResponse {
  display: Display;
  meta: Meta;
  objects: Transport[];
}

export interface TransportDataFormatted {
  arrival?: SubItemTransport | null;
  departure?: SubItemTransport | null;
  number?: number | null;
  status?: number | null;
  statusName?: TrackingDriverStatus | null;
  title?: string | null;
  mode?: TransportationMode | null;
  id?: number | null;
}

export type Transport = TransportDataFormatted & {
  trackingDriver?: TrackingDriver;
};

export interface GetChangeStepStatusInput {
  email?: string | null;
  name?: string | null;
}
export type TransportationResponseType = GetTransportationFormattedResponse & {
  id?: number | null;
  status?: number | null;
  result?: boolean | null;
};

export interface ChangeStatusDataFormatted {
  id?: number | null;
  mode?: string | null;
  status?: number | null;
}
