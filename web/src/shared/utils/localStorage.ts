import type { GetContactResponse } from './type';
import { appConfig } from '#/configs/config';
import { LoginFormValues } from '#/pages/login';

export const LOCAL_STORAGE_TOKEN_KEY = `${appConfig.name}_access_token`;
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY = `${appConfig.name}_refresh_token`;
export const LOCAL_STORAGE_EMAIL = `${appConfig.name}_email`;
export const LOCAL_STORAGE_NAME = `${appConfig.name}_name`;
export const LOCAL_STORAGE_CASE_NAME = `${appConfig.name}_case_name`;
export const LOCAL_STORAGE_PROVIDER_COMPANY_NAME = `${appConfig.name}_provider_company_name`;
export const LOCAL_STORAGE_CONTACT_DATA = `${appConfig.name}_contact_data`;

// Email

export const getEmail = () => localStorage.getItem(LOCAL_STORAGE_EMAIL);

export const setEmail = (email: string) =>
  localStorage.setItem(LOCAL_STORAGE_EMAIL, email);

export const clearEmail = () => localStorage.removeItem(LOCAL_STORAGE_EMAIL);

// Name

export const getName = () => localStorage.getItem(LOCAL_STORAGE_NAME);

export const setName = (name: string) =>
  localStorage.setItem(LOCAL_STORAGE_NAME, name);

// Login Information

export const setLoginInformation = (infor: LoginFormValues) =>
  localStorage.setItem('loginInformation', JSON.stringify(infor));

export const getLoginInformation = (): LoginFormValues | undefined => {
  const loginInformation = localStorage.getItem('loginInformation');

  return loginInformation ? JSON.parse(loginInformation) : undefined;
};

export const clearLoginInformation = () =>
  localStorage.removeItem('loginInformation');

// Case Name

export const clearName = () => localStorage.removeItem(LOCAL_STORAGE_NAME);

export const getCaseName = () => localStorage.getItem(LOCAL_STORAGE_CASE_NAME);

export const setCaseName = (name: string) =>
  localStorage.setItem(LOCAL_STORAGE_CASE_NAME, name);

export const clearCaseName = () =>
  localStorage.removeItem(LOCAL_STORAGE_CASE_NAME);

// Token

export const getToken = () => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

export const setToken = (accessToken: string) => {
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
};

export const clearToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
};

// Provider Company Name

export const getProviderCompanyName = () =>
  localStorage.getItem(LOCAL_STORAGE_PROVIDER_COMPANY_NAME);

export const setProviderCompanyName = (name: string) =>
  localStorage.setItem(LOCAL_STORAGE_PROVIDER_COMPANY_NAME, name);

export const clearProviderCompanyName = () =>
  localStorage.removeItem(LOCAL_STORAGE_PROVIDER_COMPANY_NAME);

// Contact Data

export const getContactData = () =>
  localStorage.getItem(LOCAL_STORAGE_CONTACT_DATA);

export const setContactData = (contact: GetContactResponse) =>
  localStorage.setItem(LOCAL_STORAGE_CONTACT_DATA, JSON.stringify(contact));

export const clearContactData = () =>
  localStorage.removeItem(LOCAL_STORAGE_CONTACT_DATA);
