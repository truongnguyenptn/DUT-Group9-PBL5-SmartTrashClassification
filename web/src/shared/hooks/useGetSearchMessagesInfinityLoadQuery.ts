import type { DeepPartial } from '@enouvo/react-uikit';
import { showError } from '@enouvo/react-uikit';
import { useContext, useState } from 'react';
import uniqBy from 'lodash-es/uniqBy';
import dayjs from 'dayjs';
import { DEFAULT_PAGE } from '../utils/constant';
import type { GetSearchMessagesFilter } from '../utils/type/message';
import { ChatContext } from '../context/chat';
import { useInboxVar } from './useInboxVar';
import { QueryOperator, useGetMessagesLazyQuery } from '#/generated/schemas';
import type { Message } from '#/generated/schemas';

interface UseGetSearchMessageInfinityLoadProps {
  onFindMessages?: (message: DeepPartial<Message>) => void;
  onClear?: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

const useGetSearchMessagesInfinityLoadLazyQuery = ({
  onFindMessages,
  onClear,
}: UseGetSearchMessageInfinityLoadProps) => {
  const { searchValue, isPendingChat, rangeDate } = useContext(ChatContext);
  const { inbox } = useInboxVar();

  const [searchMessages, setSearchMessages] = useState<DeepPartial<Message>[]>(
    [],
  );
  const [getSearchMessagesLoading, setGetSearchMessagesLoading] =
    useState(false);

  const [searchMessageIndex, setSearchMessageIndex] = useState<number>(0);

  const [pagination, setPagination] = useState({
    pageNumber: DEFAULT_PAGE,
    totalItems: 0,
    totalPage: 1,
  });

  const [getSearchMessages] = useGetMessagesLazyQuery({
    fetchPolicy: 'network-only',
  });

  const onSearchMessages = async ({
    searchRangeDate,
    searchString,
  }: GetSearchMessagesFilter) => {
    searchValue.setValue(searchString);
    setSearchMessageIndex(0);
    setGetSearchMessagesLoading(true);
    isPendingChat.setValue(true);
    rangeDate.setValue(searchRangeDate);
    if (inbox?.id) {
      try {
        const { data } = await getSearchMessages({
          variables: {
            queryParams: {
              filters: [
                {
                  data: inbox.id,
                  field: 'Message.inboxId',
                  operator: QueryOperator.Eq,
                },
              ],
              limit: DEFAULT_PAGE_SIZE,
              page: 1,
              q: searchString?.trim(),
              ...(searchRangeDate?.[0] && {
                endDate: dayjs(searchRangeDate[1])
                  .utc()
                  .endOf('date')
                  .format('YYYY-MM-DD HH:mm:ss'),
                startDate: dayjs(searchRangeDate[0])
                  .utc()
                  .startOf('date')
                  .format('YYYY-MM-DD HH:mm:ss'),
              }),
            },
          },
        });
        if (data?.getMessages) {
          const { meta } = data.getMessages;
          setGetSearchMessagesLoading(false);
          if (meta.currentPage === 1) {
            const messages = data.getMessages.items;
            setSearchMessages(messages);
            setPagination({
              pageNumber: meta.currentPage,
              totalItems: meta.totalItems,
              totalPage: meta.totalPages,
            });
            onFindMessages?.(messages[0]);
          }
        }
      } catch (error) {
        isPendingChat.setValue(false);
        setGetSearchMessagesLoading(false);
      }
    } else {
      onFindMessages?.({});
    }
  };
  const loadMoreSearchMessages = async () => {
    if (
      pagination.pageNumber >= pagination.totalPage ||
      getSearchMessagesLoading
    )
      return;

    if (inbox?.id) {
      isPendingChat.setValue(true);
      setGetSearchMessagesLoading(true);
      try {
        const responseData = await getSearchMessages({
          variables: {
            queryParams: {
              filters: [
                {
                  data: inbox.id,
                  field: 'Message.inboxId',
                  operator: QueryOperator.Eq,
                },
              ],
              limit: DEFAULT_PAGE_SIZE,
              page: pagination.pageNumber + 1,
              q: searchValue.value?.trim(),
              ...(rangeDate.value?.[0] && {
                endDate: dayjs(rangeDate.value[1])
                  .utc()
                  .endOf('date')
                  .format('YYYY-MM-DD HH:mm:ss'),
                startDate: dayjs(rangeDate.value[0])
                  .utc()
                  .startOf('date')
                  .format('YYYY-MM-DD HH:mm:ss'),
              }),
            },
          },
        });
        const messages = responseData.data?.getMessages.items ?? [];
        const meta = responseData.data?.getMessages.meta;
        const newSearchMessages = uniqBy(
          [...searchMessages, ...messages],
          'id',
        );
        setSearchMessages(newSearchMessages);
        setSearchMessageIndex(prev => prev + 1);
        setPagination({
          pageNumber: meta?.currentPage ?? DEFAULT_PAGE,
          totalItems: meta?.totalItems ?? 0,
          totalPage: meta?.totalPages ?? 1,
        });
        onFindMessages?.(newSearchMessages[searchMessageIndex + 1]);
      } catch (error) {
        showError(error);
      } finally {
        setGetSearchMessagesLoading(false);
      }
    }
  };

  const onChangeSearchMessagePosition = async (isUp: boolean) => {
    if (isUp) {
      if (searchMessageIndex === searchMessages.length - 1) {
        await loadMoreSearchMessages();
      } else {
        setSearchMessageIndex(prev => prev + 1);
        onFindMessages?.(searchMessages[searchMessageIndex + 1]);
      }
    } else {
      setSearchMessageIndex(prev => prev - 1);
      onFindMessages?.(searchMessages[searchMessageIndex - 1]);
    }
  };

  const onClearSearchMessages = () => {
    onClear?.();
    setSearchMessages([]);
    searchValue.setValue(undefined);
    rangeDate.setValue(undefined);
    setPagination({
      pageNumber: DEFAULT_PAGE,
      totalItems: 0,
      totalPage: 1,
    });
  };

  return {
    disabledDownSearch: searchMessageIndex === 0 || !searchMessages[0],
    disabledUpSearch:
      (searchMessageIndex === searchMessages.length - 1 &&
        pagination.pageNumber >= pagination.totalPage) ||
      !searchMessages[0],
    getSearchMessagesLoading,
    loadMoreSearchMessages,
    onChangeSearchMessagePosition,
    onClearSearchMessages,
    onSearchMessages,
    searchMessageIndex,
    searchMessages,
    totalSearchMessages: pagination.totalItems,
  };
};

export default useGetSearchMessagesInfinityLoadLazyQuery;
