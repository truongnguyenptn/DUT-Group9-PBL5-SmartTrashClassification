import type { DeepPartial } from '@enouvo/react-uikit';
import { showError } from '@enouvo/react-uikit';
import { useRef, useState } from 'react';
import uniqBy from 'lodash-es/uniqBy';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  HASH_VALUE,
  REFETCH_MESSAGE_INTERVAL_TIME,
} from '../utils/constant';
import { useInboxVar } from './useInboxVar';
import type { Message } from '#/generated/schemas';
import { QueryOperator, useGetMessagesQuery } from '#/generated/schemas';

interface UseGetMessagesInfinityLoadProps {
  skip?: boolean;
}

const useGetMessagesInfinityLoad = ({
  skip,
}: UseGetMessagesInfinityLoadProps) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    DeepPartial<Message>[] | undefined
  >();
  const [pagination, setPagination] = useState({
    pageNumber: DEFAULT_PAGE,
    totalPage: 1,
  });
  const { hash } = useLocation();
  const { inbox } = useInboxVar();
  const isSetPagination = useRef(false);

  const defaultParams = {
    filters: [
      {
        data: inbox?.id,
        field: 'Message.inboxId',
        operator: QueryOperator.Eq,
      },
    ],
    limit: DEFAULT_PAGE_SIZE,
  };

  const { fetchMore, error } = useGetMessagesQuery({
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const { meta } = data.getMessages;
      setLoading(false);
      if (meta.currentPage === 1) {
        const messages = data.getMessages.items;
        setMessages(oldData => uniqBy([...messages, ...(oldData ?? [])], 'id'));
        if (!isSetPagination.current) {
          isSetPagination.current = true;
          setPagination({
            pageNumber: meta.currentPage,
            totalPage: meta.totalPages || 1,
          });
        }
      }
    },
    onError() {
      setLoading(false);
    },
    pollInterval: REFETCH_MESSAGE_INTERVAL_TIME, // ms
    skip: hash !== HASH_VALUE || !inbox?.id || skip,
    variables: {
      queryParams: {
        ...defaultParams,
        page: DEFAULT_PAGE,
      },
    },
  });

  const loadMore = async (event: React.UIEvent) => {
    if (pagination.pageNumber >= pagination.totalPage || loading) return;
    const target = event.target as HTMLDivElement;
    if (target.scrollTop === 0 && inbox?.id && !skip) {
      setLoading(true);

      try {
        const responseData = await fetchMore({
          variables: {
            queryParams: {
              ...defaultParams,
              page: pagination.pageNumber + 1,
            },
          },
        });
        const messages = responseData.data.getMessages.items;
        const { meta } = responseData.data.getMessages;
        target.scrollTo({ top: 200 });
        setMessages(oldData => uniqBy([...(oldData ?? []), ...messages], 'id'));
        setPagination({
          pageNumber: meta.currentPage || DEFAULT_PAGE,
          totalPage: meta.totalPages || 1,
        });
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    error,
    getMessagesLoading: loading,
    loadMoreMessages: loadMore,
    messages,
    setMessages,
  };
};

export default useGetMessagesInfinityLoad;
