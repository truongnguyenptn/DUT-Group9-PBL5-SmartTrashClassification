import { useReactiveVar } from '@apollo/client';
import { useCallback } from 'react';
import { GetContactResponse } from '../utils/type';
import { contactDataVar } from '#/graphql/cache';

export const useContactDataVar = () => {
  const contactData = useReactiveVar(contactDataVar);

  const update = useCallback((newValue: GetContactResponse | null) => {
    contactDataVar(newValue);
  }, []);

  return {
    contactData,
    update,
  };
};
