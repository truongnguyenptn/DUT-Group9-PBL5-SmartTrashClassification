import { useReactiveVar } from '@apollo/client';
import { DeepPartial } from '@enouvo/react-uikit';
import { useCallback } from 'react';
import { inboxVar } from '#/graphql/cache';
import { IInbox } from '#/generated/schemas';

export const useInboxVar = () => {
  const inbox = useReactiveVar(inboxVar);

  const update = useCallback((newValue: DeepPartial<IInbox> | undefined) => {
    inboxVar(newValue);
  }, []);

  const clear = useCallback(() => {
    inboxVar({});
  }, []);

  return {
    clear,
    inbox,
    update,
  };
};
