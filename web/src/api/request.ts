import axios from 'axios';
import { getToken } from '../shared/utils/localStorage';
import { getLocale } from './../shared/utils/locale';
import i18n from '#/shared/i18n';
import { ErrorCode } from '#/shared/utils/type/common';

const TIME_OUT = 60000;

export const BASE_URL =
  window.location.host === 'localhost'
    ? 'https://mock-endpoint.com'
    : import.meta.env.VITE_BASE_URL;

const baseApiConfig = {
  baseURL: BASE_URL,
  headers: {
    ['content-type']: 'application/json',
  },
  timeout: TIME_OUT,
};

const request = axios.create(baseApiConfig);

request.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Accept = 'application/json';
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.params = {
    ...(config.params ?? {}),
    ['api_key']: import.meta.env.VITE_API_KEY,
    lang: getLocale() || 'en',
  };

  return config;
});

request.interceptors.response.use(
  response => response,
  error => {
    switch (error.code) {
      case ErrorCode.ERR_BAD_REQUEST:
        throw new Error(String(i18n.t('error.inValidAccLogin')));
      case ErrorCode.ERR_NETWORK:
        throw new Error(String(i18n.t('error.lostConnection')));
      case ErrorCode.ECONNABORTED:
        throw new Error(String(i18n.t('error.requestTimeOut')));
      default:
        throw new Error(String(i18n.t('error.internalServerError')));
    }
  },
);

export default request;
