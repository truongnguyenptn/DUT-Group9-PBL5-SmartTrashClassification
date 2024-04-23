import { Button, ConfigProvider, Modal, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewTrackingDriverDetails from './ViewTrackingDriverDetails';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { Transport } from '#/shared/utils/type/transportation';
import { useGetTrackingDriverQuery } from '#/generated/schemas';
import { TRACK_DRIVER_HASH_VALUE } from '#/shared/utils/constant';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';

const StyledModal = styled(Modal)`
  .ant-modal {
    &-content {
      height: 100% !important;
      padding: 0rem !important;
      border-radius: 1rem !important;
      .ant-btn {
        border-radius: 0.5rem !important;
      }
      overflow: hidden;
    }
    &-body {
      height: calc(100% - 3.25rem) !important;
      padding: 1rem !important;
    }
    &-header {
      padding: 0.75rem !important;
      background-color: var(--primary-color) !important;
      border-radius: 0 !important;
      margin: 0 !important;
    }
  }

  @media only screen and (max-width: 768px) {
    .ant-modal {
      padding: 0 !important;
      max-width: 100%;
      margin: 0;
      border-top: 0;
      border-radius: 0;
      &-content {
        border-radius: 0 !important;
      }
      &-body {
        padding: 0.5rem 0 0 !important;
      }
      &-close {
        margin-top: 0.5rem !important;
      }
    }
  }
`;

interface ViewDetailsButtonProps {
  transport: Transport;
  trackingDriverId: string;
}

export function ViewDetailsButton({
  transport,
  trackingDriverId,
}: ViewDetailsButtonProps) {
  const navigate = useNavigate();
  const { t } = useTypeSafeTranslation();
  const { hash } = useLocation();
  const { data, refetch, loading } = useGetTrackingDriverQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      allowExpiredLink: true,
      trackingDriverId,
    },
  });
  const { onShow } = useSectionLayoutGoogleMapVisible();

  const trackingDriver = data?.getTrackingDriver;
  const trackDriverHashId = `${TRACK_DRIVER_HASH_VALUE}/${transport.id}`;
  const onCloseModal = () => {
    onShow();
    navigate({ hash: '' });
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            ['Button']: {
              borderRadius: 24,
              colorBorder: '#3765DE',
              colorText: '#3765DE',
              controlHeight: 40,
            },
          },
          token: {
            colorPrimary: '#3765DE',
          },
        }}
      >
        <Button
          onClick={() => {
            refetch();
            navigate({ hash: trackDriverHashId });
          }}
        >
          {t('button.trackDriver')}
        </Button>
      </ConfigProvider>
      <StyledModal
        centered
        className="h-full w-[75rem] py-16 md:m-0 md:max-w-full md:p-0"
        closable={false}
        destroyOnClose
        footer={false}
        getContainer={document.getElementById('root') ?? false}
        maskClosable
        onCancel={onCloseModal}
        open={hash === trackDriverHashId}
        title={
          <div className="relative flex w-full items-center justify-center bg-primary md:justify-start">
            <div className="flex items-center justify-center">
              <Typography.Text className="flex items-center text-lg font-semibold text-white md:ml-4">
                {t('button.trackDriver')}
              </Typography.Text>
            </div>
            <div
              className="absolute right-0 cursor-pointer text-white"
              onClick={onCloseModal}
            >
              <CloseOutlined />
            </div>
          </div>
        }
      >
        <ViewTrackingDriverDetails
          loading={loading}
          transport={{
            ...transport,
            trackingDriver,
          }}
        />
      </StyledModal>
    </>
  );
}
