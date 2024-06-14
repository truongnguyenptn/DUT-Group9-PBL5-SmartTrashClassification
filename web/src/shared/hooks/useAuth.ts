import { showError, showSuccess } from '@enouvo/react-uikit';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useContactDataVar } from './useContactDataVar';
import { getContactApi } from '#/api/contact';
import {
  setContactData,
  setEmail,
  setCaseName,
  setProviderCompanyName,
  setName,
  setLoginInformation,
  clearCaseName,
  clearContactData,
  clearEmail,
  clearName,
  clearProviderCompanyName,
  getContactData,
  clearLoginInformation,
  setToken,
  clearToken,
} from '#/shared/utils/localStorage';
import { scrollToTop } from '#/shared/utils/tool';
import { PATH_URL } from '#/shared/utils/constant';
import request from '#/api/request';

export function useAuth() {
  const navigate = useNavigate();
  const { update } = useContactDataVar();

  const {
    mutate: getContact,
    isLoading,
    isError,
  } = useMutation(getContactApi, {
    networkMode: 'always',
    onError: showError,
    onSuccess: (data, { email, name }) => {
      const { defunct, data: responseData } = data.data.objects;

      const username = [
        (defunct.civility ?? '').trim(),
        (defunct.first_name ?? '').trim(),
        (defunct.last_name ?? '').trim(),
      ].join(' ');

      update(data.data);
      setContactData(data.data);
      setEmail(email);
      setCaseName(defunct.last_name ?? name);
      setProviderCompanyName(responseData.name ?? '');
      setName(username);
      showSuccess(t('message.loginSuccess'));
      navigate(PATH_URL.home);
      scrollToTop();
    },
  });

  return {
    isError,
    isLoading,
    login: async (username: string, password: string, rememberMe: boolean) => {
      try {
        const response = await request.post(`/login`, {
          username,
          password
        });
        if (response.data.access_token) {
          setToken(JSON.stringify(response.data));
        }

        setProviderCompanyName("company");
        setName("smartcity");
        setName("smartcity@gmail.com");

        showSuccess(t('message.loginSuccess'));
        navigate(PATH_URL.home);
        scrollToTop();
      }
      catch (error) {
        showError(t('error.pleaseTryAgain'));
      }
    },
    signOut: () => {
      clearEmail();
      clearName();
      clearProviderCompanyName();
      clearContactData();
      clearCaseName();
      clearToken();

      navigate(PATH_URL.login);
    },
  };
}
