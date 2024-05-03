import { Display, Meta } from './common';

export interface GetContactInput {
  email: string;
  name: string;
  remember?: boolean;
}

export interface TerraDocument {
  name: string;
  url: string;
  ['pc_status']: number;
  ['pc_status_name']: string;
  section: string;
}

export interface ContactData {
  address?: string;
  ['address_complement']?: string;
  city?: string;
  ['contact_first_name']?: string | null;
  ['contact_last_name']?: string | null;
  country?: string;
  documents?: TerraDocument[];
  website?: string;
  whatsapp?: string;
  empowermentNumber?: string;
  civilLiabilityInsurance?: string;
  ['email_1']?: string;
  ['email_2']?: string;
  location?: string | null;
  name?: string;
  ['phone_1']?: string;
  ['phone_2']?: string;
  zipcode?: string;
  region?: string;
}

export interface Defunct {
  ['birth_date']?: string;
  civility?: string;
  ['dead_date']?: string;
  ['dead_time']?: string;
  ['first_name']?: string;
  ['last_name']?: string;
  photo?: string;
}

export interface Family {
  civility?: string;
  ['first_name']?: string;
  ['last_name']?: string;
}

export interface Objects {
  defunct: Defunct;
  family?: Family;
  ['funeral_assistant']: ContactData;
  ['funeral_services']: ContactData;
  insurance: ContactData;
  data: ContactData;
}

export interface GetContactResponse {
  display: Display;
  meta: Meta;
  objects: Objects;
}

export enum DocumentStatus {
  Qr = 'QR',
  Select = 'SELECT',
  Rec = 'RED',
  Paid = 'PAID',
  Bpa = 'BPA',
  Gest = 'GEST',
  Compta = 'COMPTA',
}

export type DocumentSectionType =
  | 'form'
  | 'tasks'
  | 'comments'
  | 'detail'
  | 'documents'
  | 'history'
  | 'logistics'
  | 'payment'
  | 'photo'
  | 'preview'
  | 'quotes';
