import { Col, Popover, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import { ReactComponent as InfoCircleFilledSVG } from '#/assets/svgs/info-circle-filled.svg';
import { STATUS } from '#/shared/utils/constant';

const { Title, Text } = Typography;

function StatusLegend() {
  const { t } = useTranslation();

  function PopoverContent() {
    return (
      <div className="w-[18.5rem] bg-white p-2">
        <Title className="text-xl font-semibold leading-8 text-grey">
          {t('statusLegend.title')}
        </Title>
        <Row className="w-full justify-between gap-2" gutter={12}>
          {STATUS.map(item => (
            <Col className="w-[8.2rem] pb-[0.375rem]" key={item.title}>
              <div
                className={`${item.bg} ${item.color} h-10 w-[8.2rem] rounded-3xl px-4 pt-[0.625rem] text-sm font-medium`}
              >
                <span className="h-8 w-8">●</span>
                <Text className={`${item.color} ml-2 text-sm leading-none`}>
                  {t(item.title)}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <Popover
      arrowPointAtCenter
      content={PopoverContent}
      getPopupContainer={triggerNode =>
        document.getElementById('root') || triggerNode
      }
      placement="topRight"
      trigger="click"
      {...(isMobile && {
        transitionName: '',
      })}
    >
      <InfoCircleFilledSVG className="h-6 w-6 text-sm text-primary" />
    </Popover>
  );
}
export default StatusLegend;
