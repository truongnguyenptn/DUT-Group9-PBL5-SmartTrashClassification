import {
  DocumentNode,
  TypedDocumentNode,
  useQuery,
  FetchPolicy,
} from '@apollo/client';
import { useState } from 'react';
import debounce from 'lodash-es/debounce';
import { DEFAULT_PAGE } from '../utils/constant';
import {
  Maybe,
  MetaPaginationInterface,
  QueryFilterDto,
} from '#/generated/schemas';

export interface FormatDataResponse {
  meta?: Maybe<MetaPaginationInterface>;
  items?: Maybe<unknown>[] | null;
}

interface Props<TData, TVariables> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  formatData: (e: TData) => FormatDataResponse | null | undefined;
  queryId?: string;
  variables?: TVariables & {
    queryParams?: QueryFilterDto;
  };
  fetchPolicy?: FetchPolicy;
  skip?: boolean;
  onCompleted?: (data: TData) => void;
}

const BROWSER_OFFSET = 10;
const DEFAULT_PAGE_SIZE = 10;

export const useInfiniteLoadQuery = <TData, TVariables, T>({
  query,
  variables,
  queryId,
  formatData,
  skip,
  fetchPolicy = 'cache-first',
  onCompleted,
}: Props<TData, TVariables>) => {
  const [data, setData] = useState<unknown[]>([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    total: 10,
    totalPage: 1,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const { error, refetch } = useQuery<TData>(query, {
    fetchPolicy,
    onCompleted(data) {
      setLoading(false);
      onCompleted?.(data);
      const formatedData = formatData(data);
      if (formatedData?.meta?.currentPage === 1) {
        setData(formatedData.items || []);
        setPageNumber(2);
        setPagination({
          pageNumber: formatedData.meta.currentPage,
          pageSize: formatedData.meta.itemsPerPage || DEFAULT_PAGE_SIZE,
          total: formatedData.meta.totalItems || DEFAULT_PAGE_SIZE,
          totalPage: formatedData.meta.totalPages || DEFAULT_PAGE,
        });
      }
    },
    onError: () => {
      setLoading(false);
    },
    skip,
    variables: {
      id: queryId,
      queryParams: {
        page: 1,
        ...variables?.queryParams,
      },
    },
  });

  const loadMore = (event: React.UIEvent) => {
    if (pagination.pageNumber >= pagination.totalPage) return;
    const target = event.target as HTMLDivElement;
    if (
      !loading &&
      target.scrollTop + target.offsetHeight <=
        target.scrollHeight + BROWSER_OFFSET &&
      target.scrollTop + target.offsetHeight >=
        target.scrollHeight - BROWSER_OFFSET
    ) {
      setLoading(true);
      target.scrollTo({
        behavior: 'smooth',
        top: target.scrollTop + target.offsetHeight - 20,
      });
      refetch({
        queryParams: {
          ...variables?.queryParams,
          page: pageNumber,
        },
      })
        .then(data => {
          const formatedData = formatData(data.data);
          setPageNumber(currentPage => currentPage + 1);
          setData(oldData => [...oldData, ...(formatedData?.items || [])]);
          setPagination({
            pageNumber: formatedData?.meta?.currentPage || 1,
            pageSize: formatedData?.meta?.itemsPerPage || 10,
            total: formatedData?.meta?.totalItems || 10,
            totalPage: formatedData?.meta?.totalPages || 1,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onSearch = debounce((value: string) => {
    setLoading(true);
    refetch({
      queryParams: {
        ...variables?.queryParams,
        limit: 10,
        page: 1,
        q: value.trim(),
      },
    })
      .then(data => {
        const formatedData = formatData(data.data);
        setPageNumber(1);
        setData(formatedData?.items ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 400);

  return {
    data: data as T[],
    error,
    hasMore: pagination.pageNumber < pagination.totalPage,
    loadMore,
    loading,
    onSearch,
    pageNumber,
    pagination,
    refetch,
    setData,
    setPageNumber,
    setPagination,
  };
};
