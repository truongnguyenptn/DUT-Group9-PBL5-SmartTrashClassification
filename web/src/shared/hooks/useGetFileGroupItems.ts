import { showError } from '@enouvo/react-uikit';
import { useState } from 'react';
import uniqBy from 'lodash-es/uniqBy';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/constant';
import {
  MessageFile,
  QueryOperator,
  useGetMessageFilesQuery,
} from '#/generated/schemas';

interface UseGetFileGroupItemsProps {
  id?: string;
  filterKey: string;
  onCompletedFetchData?: () => void;
  limitSize?: number;
  skip?: boolean;
}

const useGetFileGroupItems = ({
  id,
  filterKey,
  onCompletedFetchData,
  limitSize,
  skip = false,
}: UseGetFileGroupItemsProps) => {
  const [listItems, setListItems] = useState<MessageFile[] | []>([]);

  const [pagination, setPagination] = useState({
    pageNumber: DEFAULT_PAGE,
    totalItem: 0,
    totalPage: DEFAULT_PAGE,
  });

  const defaultParams = {
    filters: [
      {
        data: filterKey,
        field: 'MessageFile.type',
        operator: QueryOperator.Eq,
      },

      {
        data: id,
        field: 'Message.inboxId',
        operator: QueryOperator.Eq,
      },
    ],
    limit: limitSize || DEFAULT_PAGE_SIZE,
    page: DEFAULT_PAGE,
  };
  const { loading } = useGetMessageFilesQuery({
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const { meta, items } = data.getMessageFiles;
      if (pagination.pageNumber === 1) {
        setListItems(items);
      } else {
        setListItems(uniqBy([...listItems, ...items], 'id'));
      }
      setPagination({
        pageNumber: meta.currentPage || DEFAULT_PAGE,
        totalItem: meta.totalItems || 0,
        totalPage: meta.totalPages || DEFAULT_PAGE,
      });
      onCompletedFetchData?.();
    },

    onError(error) {
      showError(error);
    },
    skip: !id || skip,
    variables: {
      queryParams: {
        ...defaultParams,
        page: pagination.pageNumber,
      },
    },
  });

  const loadMore = async () => {
    setPagination({
      ...pagination,
      pageNumber: pagination.pageNumber + 1,
    });
  };
  return {
    getMessageFileLoading: loading,
    listItems,
    loadMoreMessageFiles: loadMore,
    pagination,
    setListItems,
  };
};
export default useGetFileGroupItems;
