import type { ColumnsType } from 'antd/es/table';
import { Grid, Table, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import SectionLayout from '../layouts/SectionLayout';
import LoadingScreen from '../common/LoadingScreen';
import { TerraDocument } from '#/shared/utils/type';
import { getDocumentSection, getDocumentStatus } from '#/shared/utils/tool';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { formatDateWithHour } from '#/shared/utils/date';
import { DATE_FORMAT, IS_MD_SCREEN } from '#/shared/utils/constant';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';
import { truncateFileName } from '#/shared/utils/file-name';
import { LeafletMap } from '../map';

const StyledTable = styled(Table<TerraDocument>)`
  .ant-table {
    border: 1px solid var(--scroll-bar);
    &-body {
      max-height: calc(100vh - 17.4rem) !important;
    }
  }

  @media (max-width: 768px) {
    .ant-table {
      border: none !important;
      &-thead {
        tr {
          &:first-child {
            border-bottom-left-radius: 0.5rem !important;
          }
        }
      }
    }
  }
`;

function DocumentsContainer() {
  const { t } = useTypeSafeTranslation();
  const { md } = Grid.useBreakpoint();

  const [initialLoading, setInitialLoading] = useState(true);

  const isMdScreen = md !== undefined ? md : !IS_MD_SCREEN;

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SectionLayout isEmpty={false}>
      <LeafletMap />
      <iframe
        src="http://127.0.0.1:5050/route"
        allow="geolocation"
        title="Route Page"
        width="100%"
        height="500px"
        frameBorder="0"
        scrolling="auto"
      ></iframe>
    </SectionLayout>
  );
}

export default DocumentsContainer;
