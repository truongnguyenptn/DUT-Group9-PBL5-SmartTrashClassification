import { useReactiveVar } from '@apollo/client';
import { useCallback } from 'react';
import { selectedMessageIdVar } from '#/graphql/cache';

export const useGetSelectedMessageId = () => {
  const selectedMessageId = useReactiveVar(selectedMessageIdVar);

  const update = useCallback(
    (id: string) => (id ? selectedMessageIdVar(id) : undefined),
    [],
  );

  const clear = useCallback(() => selectedMessageIdVar(null), []);

  return {
    clear,
    selectedMessageId,
    update,
  };
};
