import { Col, Row } from 'antd';
import type { Dispatch, SetStateAction } from 'react';
import Pagination from './Pagination';
import { scrollToTop } from '#/shared/utils/tool';

interface Props {
  current: number;
  pageSize: number;
  total: number;
  showQuickJumper?: boolean;
  className?: string;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isScrollable?: boolean;
}

function PaginationPanel({
  current,
  pageSize,
  total,
  showQuickJumper = false,
  setCurrentPage,
  className,
  isScrollable = true,
}: Props) {
  const handlePageChanging = (page: number, isScrollable: boolean) => {
    setCurrentPage(page);
    if (isScrollable) {
      scrollToTop();
    }
  };

  return (
    <Row className="w-full">
      <Col className={className} xs={24}>
        <Pagination
          current={current}
          onChange={page => handlePageChanging(page, isScrollable)}
          pageSize={pageSize}
          showQuickJumper={showQuickJumper}
          showSizeChanger={false}
          showTotal={(total: number) => (
            <div className="font-medium">{`${total} items`}</div>
          )}
          total={total}
        />
      </Col>
    </Row>
  );
}

export default PaginationPanel;
