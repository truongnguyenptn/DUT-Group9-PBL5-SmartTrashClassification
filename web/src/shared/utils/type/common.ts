export interface Display {
  contacts: number;
  formalities: number;
  funeral: number;
  questions: number;
  rmr: number;
}

export interface Meta {
  ['folder_email']: string;
  ['folder_id']: string;
  lang: string;
  ['total_count']: number;
}

export enum ErrorCode {
  ERR_BAD_REQUEST = 'ERR_BAD_REQUEST',
  ERR_NETWORK = 'ERR_NETWORK',
  ECONNABORTED = 'ECONNABORTED',
}
