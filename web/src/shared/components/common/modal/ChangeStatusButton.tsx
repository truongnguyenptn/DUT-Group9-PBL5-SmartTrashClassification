import styled from '@emotion/styled';
import { Modal, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { ChangeStepStatusContent } from '#/shared/components/common/modal/ChangeStepStatusContent';
import { ReactComponent as ChangedFilledSVG } from '#/assets/svgs/changed-filled.svg';
import { ChangeStatusDataFormatted } from '#/shared/utils/type/transportation';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { CHANGE_STATUS_HASH_VALUE } from '#/shared/utils/constant';

interface ChangedProps {
  item: ChangeStatusDataFormatted | undefined;
}

const StyledModal = styled(Modal)`
  .ant-modal {
    &-header {
      position: absolute;
      top: 0.938rem;
      left: 0;
      width: 100%;
      border-bottom: 1px solid var(--scroll-bar);
    }
    &-title {
      margin-left: 1.5rem !important;
      padding: 0 0 0.5rem;
      font-weight: 600;
      font-size: 1.5rem !important;
      text-transform: capitalize;
    }
    &-body {
      margin-top: 3.438rem !important;
    }

    &-footer {
      button {
        border-radius: 1.5rem;
        padding: 0.75rem 1.5rem;
      }
      .ant-btn-default {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
  }
`;
export function ChangeStatusButton({ item }: ChangedProps) {
  const { t } = useTypeSafeTranslation();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const changeStatusHashId = `${CHANGE_STATUS_HASH_VALUE}/${item?.id}`;
  const onOpenModal = () => {
    navigate({ hash: changeStatusHashId });
  };
  const onCloseModal = () => {
    navigate({ hash: '' });
  };

  const renderTooltip = (children: React.ReactNode) => {
    if (!isMobile) {
      return (
        <Tooltip
          destroyTooltipOnHide
          mouseEnterDelay={0.3}
          placement="topLeft"
          title={t('transportation.changeStatus')}
          transitionName=""
          zIndex={10}
        >
          {children}
        </Tooltip>
      );
    }
    return children;
  };
  return (
    <div onClick={e => e.stopPropagation()}>
      {renderTooltip(
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white"
          data-testid="change-status-btn"
          onClick={onOpenModal}
        >
          <ChangedFilledSVG
            className=" text-default-info"
            height={20}
            width={20}
          />
        </div>,
      )}
      <StyledModal
        centered
        closable
        closeIcon={<CloseOutlined />}
        destroyOnClose
        footer={false}
        onCancel={onCloseModal}
        open={hash == changeStatusHashId}
        title={t('transportation.changeStatus')}
        width={572}
      >
        <ChangeStepStatusContent item={item} onClose={onCloseModal} />
      </StyledModal>
    </div>
  );
}
