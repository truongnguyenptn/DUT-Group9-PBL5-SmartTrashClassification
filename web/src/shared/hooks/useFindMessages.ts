import type { DeepPartial } from '@enouvo/react-uikit';
import { showError } from '@enouvo/react-uikit';
import { useState } from 'react';
import uniqBy from 'lodash-es/uniqBy';
import last from 'lodash-es/last';
import { DEFAULT_PAGE } from '../utils/constant';
import { useInboxVar } from './useInboxVar';
import type { Message } from '#/generated/schemas';
import { QueryOperator, useFindMessagesLazyQuery } from '#/generated/schemas';

const DEFAULT_PAGE_SIZE = 20;

const useFindMessages = ({ onCompleted }: { onCompleted?: () => void }) => {
  const [searchMessage, setSearchMessage] = useState<DeepPartial<Message>>();
  const [filteredMessages, setFilteredMessages] = useState<
    DeepPartial<Message>[] | undefined
  >();
  const [loading, setLoading] = useState(false);
  const { inbox } = useInboxVar();

  const [isLoadingUp, setIsLoadingUp] = useState(false);
  const [isLoadingDown, setIsLoadingDown] = useState(false);

  const [pagination, setPagination] = useState({
    pageNumber: DEFAULT_PAGE,
    totalItems: 0,
    totalPage: 1,
  });

  const [findMessages] = useFindMessagesLazyQuery({
    fetchPolicy: 'network-only',
  });

  const onLoadMore = async (
    messageId: string,
    isUp?: boolean,
    allowSetState = true,
  ) => {
    if (inbox?.id) {
      try {
        const responseData = await findMessages({
          variables: {
            input: {
              inboxId: inbox.id,
              messageId,
            },
            queryParams: {
              filters: [
                {
                  data: 'true',
                  field: isUp ? 'Message.isUp' : 'Message.isDown',
                  operator: QueryOperator.Eq,
                },
              ],
              limit: DEFAULT_PAGE_SIZE,
              orderBy: 'Message.createdAt:DESC',
            },
          },
        });
        if (allowSetState) {
          const messages = responseData.data?.findMessages.items ?? [];
          const meta = responseData.data?.findMessages.meta;
          setFilteredMessages(oldData =>
            isUp
              ? uniqBy([...(oldData ?? []), ...messages], 'id')
              : uniqBy([...messages, ...(oldData ?? [])], 'id'),
          );
          setPagination({
            pageNumber: meta?.currentPage ?? DEFAULT_PAGE,
            totalItems: meta?.totalItems ?? 1,
            totalPage: meta?.totalPages ?? 1,
          });
        } else {
          return responseData.data?.findMessages.items ?? [];
        }
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadMoreFilteredMessages = async (event: React.UIEvent) => {
    const target = event.target as HTMLDivElement;

    if (target.scrollTop === 0) {
      const lastMessageId = last(filteredMessages)?.id;
      if (
        pagination.totalItems === 1 ||
        isLoadingUp ||
        loading ||
        !lastMessageId
      )
        return;
      setIsLoadingUp(true);
      await onLoadMore(lastMessageId, true);
      target.scrollTo({ top: 200 });
      setIsLoadingUp(false);
    }

    if (target.scrollTop + target.offsetHeight + 10 >= target.scrollHeight) {
      const firstMessageId = filteredMessages?.[0]?.id;
      if (
        filteredMessages?.some(
          message => message.id === inbox?.lastMessageId,
        ) ||
        isLoadingDown ||
        loading ||
        !firstMessageId
      )
        return;

      setIsLoadingDown(true);
      await onLoadMore(firstMessageId, false);
      setIsLoadingDown(false);
    }
  };

  const onFindMessages = async (searchMessage?: DeepPartial<Message>) => {
    if (inbox?.id && searchMessage?.id) {
      setFilteredMessages(undefined);
      setLoading(true);
      setSearchMessage(searchMessage);
      const [downMessages, upMessages] = await Promise.all([
        await onLoadMore(searchMessage.id, false, false),
        await onLoadMore(searchMessage.id, true, false),
      ]);

      setFilteredMessages(oldData =>
        uniqBy(
          [
            ...(oldData ?? []),
            ...[...(downMessages ?? []), ...(upMessages ?? [])],
          ],
          'id',
        ),
      );
    } else {
      setSearchMessage({});
      setFilteredMessages([]);
    }
    onCompleted?.();
  };

  const onClearFindMessages = () => {
    setFilteredMessages(undefined);
    setSearchMessage(undefined);
    setPagination({
      pageNumber: DEFAULT_PAGE,
      totalItems: 0,
      totalPage: 1,
    });
  };

  return {
    filteredMessages,
    findMessages,
    getFilteredMessagesLoading: loading,
    isLoadingDown,
    isLoadingUp,
    loadMoreFilteredMessages,
    onClearFindMessages,
    onFindMessages,
    searchMessage,
  };
};

export default useFindMessages;
