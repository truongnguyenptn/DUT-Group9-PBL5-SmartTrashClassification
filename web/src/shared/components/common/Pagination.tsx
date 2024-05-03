import styled from '@emotion/styled';
import { Pagination as AntdPagination } from 'antd';

const Pagination = styled(AntdPagination)`
  .ant-pagination {
    border: none !important;
    &-prev,
    &-next {
      .ant-pagination-item-link {
        border: none;
      }
    }
    &-disabled {
      color: var(--color-gray);
    }
    &-item {
      color: var(--color-gray);
      border: none;
      border-radius: 0.375rem;
      background: none;
      &-active {
        background: var(--primary-color);
        a {
          color: white !important;
        }
      }
      &-hover {
        border: solid 1px var(--primary-color);
      }
      &-link {
        background-color: transparent;
      }
      a {
        color: var(--color-gray);
      }
    }
  }
`;

export default Pagination;
