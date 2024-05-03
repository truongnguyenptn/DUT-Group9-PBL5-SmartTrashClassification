import { ApolloError } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCaseName, getEmail, setContactData } from '../utils/localStorage';
import { useInboxVar } from './useInboxVar';
import { useContactDataVar } from './useContactDataVar';
import { MeQuery, useMeQuery } from '#/generated/schemas';
import { getContactApi } from '#/api/contact';
import { SectionId } from '#/shared/utils/type';

interface UseGetCurrentUserProps {
  onFinishQuery?: () => void;
  onCompleted?: (data: MeQuery) => void;
  onError?: (data: ApolloError) => void;
}

export function useGetCurrentUser({
  onFinishQuery,
  onCompleted,
  onError,
}: UseGetCurrentUserProps) {
  const email = getEmail();
  const caseName = getCaseName();
  const { update: updateInboxVar, clear } = useInboxVar();
  const { update } = useContactDataVar();

  // const { data, ...restOptions } = useMeQuery({
  //   fetchPolicy: 'network-only',

  //   onCompleted: data => {
  //     updateInboxVar({ ...data.me });
  //     onCompleted?.(data);
  //     onFinishQuery?.();
  //   },

  //   onError: data => {
  //     // window.navigator.onLine && clear();
  //     onError?.(data);
  //   },

  //   skip: !email && !caseName,
  //   variables: {
  //     email: String(email),
  //     username: String(caseName),
  //   },
  // });
  const   data =   {
    id: 1,
    email: "example1@example.com",
    username: "user1",
    clientHasNewMessage: true,
    lastMessageId: 123,
    lastNameFamilyMember: "Doe",
    firstNameFamilyMember: "John",
    civilityFamilyMember: "Mr.",
    createdAt: "2024-04-23T12:00:00Z",
    firstMessageId: 456,
    inboxName: "Family Inbox"
  }

  // useQuery({
  //   enabled: !!email && !!caseName,
  //   onSettled(data) {
  //     if (data) {
  //       update(data.data);
  //       setContactData(data.data);
  //     }
  //   },
  //   queryFn: () =>
  //     getContactApi({ email: String(email), name: String(caseName) }),
  //   queryKey: [SectionId.Contacts],
  // });

  return {
    item: useMemo(() => data?.me, [data?.me]),
    // ...restOptions,
  };
}
