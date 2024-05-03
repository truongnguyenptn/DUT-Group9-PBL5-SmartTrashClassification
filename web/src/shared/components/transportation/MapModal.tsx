import styled from '@emotion/styled';
import { Col, Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import Map, { MapProps } from '#/shared/components/common/Map';
import { HASH_MAP_VIEW } from '#/shared/utils/constant';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';
import { ReactComponent as ZoomInOutlineSVG } from '#/assets/svgs/zoom-in-outline.svg';

export const StyledMapModal = styled(Modal)`
  height: 100svh !important;
  width: 100vw !important;
  top: 0px !important;
  overflow-y: hidden !important;
  margin: 0px;
  max-width: 100vw !important;
  .ant-modal {
    &-content {
      padding: 0 !important;
    }
    margin: 0 !important;
    &-body {
      overflow-y: hidden;
      padding: 0;
      height: 100svh;
    }
    &-close {
      background-color: white !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      border-radius: 0.5rem !important;
      margin-top: -0.5rem;
      margin-right: -0.5rem;
    }
  }
  .anticon {
    svg {
      margin-bottom: 0.188rem !important;
    }
  }
`;

interface MapModalProps extends MapProps {
  closeMapModal: () => void;
}
function MapModal({ closeMapModal, ...rest }: MapModalProps) {
  const { hash } = useLocation();
  const { onShow } = useSectionLayoutGoogleMapVisible();

  return (
    <StyledMapModal
      closeIcon={
        <ZoomInOutlineSVG className="mx-auto h-6 w-6 text-grey-primary-500" />
      }
      destroyOnClose
      footer={null}
      getContainer={document.getElementById('root') ?? false}
      onCancel={() => {
        onShow();
        closeMapModal();
      }}
      open={hash === HASH_MAP_VIEW}
    >
      <Col className="h-full w-full" lg={24} md={24} sm={24}>
        <Map {...rest} />
      </Col>
    </StyledMapModal>
  );
}
export default MapModal;
