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
} from '#/shared/utils/localStorage';
import { scrollToTop } from '#/shared/utils/tool';
import { PATH_URL } from '#/shared/utils/constant';

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
    login: (email: string, name: string, rememberMe: boolean) => {
      // getContact({ email: email.toLowerCase(), name });

      // const contactData = getContactData();

      // if (contactData) {
      //   update(JSON.parse(contactData));
      // }

      // if (rememberMe) {
      //   setLoginInformation({ email, name, rememberMe });
      // } else {
      //   clearLoginInformation();
      // }

      setProviderCompanyName("company");
      setName("smartcity");
      setName("smartcity@gmail.com");

      showSuccess(t('message.loginSuccess'));
      navigate(PATH_URL.home);
      scrollToTop();
    },
    signOut: () => {
      clearEmail();
      clearName();
      clearProviderCompanyName();
      clearContactData();
      clearCaseName();

      navigate(PATH_URL.login);
    },
  };
}
