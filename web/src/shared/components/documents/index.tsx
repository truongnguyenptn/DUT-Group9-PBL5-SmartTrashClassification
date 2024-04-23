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
  const { contactData } = useContactDataVar();
  const ObjectData = contactData?.objects;

  const [initialLoading, setInitialLoading] = useState(true);

  const isMdScreen = md !== undefined ? md : !IS_MD_SCREEN;

  const documents: TerraDocument[] | undefined = useMemo(() => {
    const doc = ObjectData
      ? [
          ...(ObjectData.funeral_assistant.documents || []),
          ...(ObjectData.data.documents || []),
          ...(ObjectData.funeral_services.documents || []),
          ...(ObjectData.insurance.documents || []),
        ]
      : undefined;
    return doc;
  }, [ObjectData]);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);

    return () => clearTimeout(timer);
  }, []);

  const columns: ColumnsType<TerraDocument> = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name, { url }) => (
        <a
          className="text-blue-600"
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          {truncateFileName(name, isMdScreen ? 60 : 15)}
        </a>
      ),
      title: t('commonFields.name'),
      width: isMdScreen ? 500 : 200,
    },
    {
      dataIndex: 'section',
      key: 'section',
      render: section => (
        <div className="flex h-full w-full items-center space-x-2 text-xl">
          {section ? (
            <>
              <Icon
                className="text-gray-400"
                component={getDocumentSection(section).icon}
              />
              <Typography.Text className="min-w-[6rem]">
                {t(getDocumentSection(section).title)}
              </Typography.Text>
            </>
          ) : (
            <Typography.Text className="ml-4">
              {t('error.notAvailable')}
            </Typography.Text>
          )}
        </div>
      ),
      title: t('section.title'),
      width: 140,
    },
    {
      dataIndex: 'pc_status_name',
      key: 'pc_status_name',
      render: status => (
        <div>
          {status ? (
            <Typography.Text
              className={twMerge(
                'rounded-lg px-3 py-1 text-sm font-semibold',
                getDocumentStatus(status).bg,
              )}
            >
              {getDocumentStatus(status).title}
            </Typography.Text>
          ) : (
            <Typography.Text className="ml-2">
              {' '}
              {t('error.notAvailable')}
            </Typography.Text>
          )}
        </div>
      ),
      title: t('commonFields.status'),
      width: 140,
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: date => (
        <div>
          <Typography.Text>
            {formatDateWithHour(date, DATE_FORMAT)}
          </Typography.Text>
        </div>
      ),
      title: t('commonFields.date'),
      width: 200,
    },
  ];

  return (
    <SectionLayout isEmpty={!ObjectData || !documents?.[0]}>
      <div className="md:px-4 md:pb-4">
        <LoadingScreen delay={0} visible={initialLoading} />

        <StyledTable
          columns={columns}
          dataSource={documents}
          loading={!(ObjectData && documents?.[0])}
          pagination={false}
          scroll={{
            x: 'max-content',
            ...(isMdScreen && {
              y: 'max-content',
            }),
          }}
        />
      </div>
    </SectionLayout>
  );
}

export default DocumentsContainer;
