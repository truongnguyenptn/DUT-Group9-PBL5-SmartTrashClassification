import { showSuccess } from '@enouvo/react-uikit';
import { ModalProps, Spin, Button, Input, Modal, Typography } from 'antd';
import styled from '@emotion/styled';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

type GenerateLinkModalProps = ModalProps & {
  trackingLink?: string;
  loading?: boolean;
};

const StyledModal = styled(Modal)`
  .ant-modal {
    &-body {
      position: relative;
    }
  }
`;

export function GenerateLinkModal({
  trackingLink,
  loading,
  ...rest
}: GenerateLinkModalProps) {
  const { t } = useTypeSafeTranslation();

  return (
    <StyledModal
      className="w-fit"
      closable
      destroyOnClose
      footer={null}
      okText={
        <Typography.Text className="text-white">
          {t('transportation.goToLink')}
        </Typography.Text>
      }
      {...rest}
    >
      {(loading || !trackingLink) && (
        <div className="absolute inset-0 z-10 grid items-center bg-white">
          <Spin />
        </div>
      )}
      <Typography.Title
        className="mb-6 w-full border-b border-scroll-bar pb-3 text-2xl"
        level={4}
      >
        {t('transportation.trackingDriver')}
      </Typography.Title>
      <Typography.Text className="text-sm">
        {t('transportation.shareDesc')}
      </Typography.Text>

      <Typography.Text className="mb-1 mt-4 block text-neutral-400">
        {t('transportation.shareLink')}
      </Typography.Text>

      <div className="flex h-14 gap-x-2">
        <Input readOnly value={trackingLink} />
        <Button
          className=" h-14 rounded-lg bg-default-info text-white"
          onClick={() => {
            showSuccess(t('transportation.copyLinkSuccessfully'));
            trackingLink && navigator.clipboard.writeText(String(trackingLink));
          }}
        >
          {t('button.copyLink')}
        </Button>
      </div>
    </StyledModal>
  );
}
