import { Typography } from 'antd';
import { twMerge } from 'tailwind-merge';
import { isMobile } from 'react-device-detect';
import { GenerateButton } from './GenerateButton';
import { ChangeStatusButton } from '#/shared/components/common/modal/ChangeStatusButton';
import { ContactItem } from '#/shared/components/common/ContactItem';
import type {
  Coordinates,
  Transport,
} from '#/shared/utils/type/transportation';
import Dots from '#/shared/components/common/Dots';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import {
  convertStringToUTC,
  getColorByStatus,
  scrollToMap,
} from '#/shared/utils/tool';
import { formatDateWithHour } from '#/shared/utils/date';
import { DATE_FORMAT_FULL } from '#/shared/utils/constant';

import { ReactComponent as DepartureLocationFilledSVG } from '#/assets/svgs/departure-filled.svg';
import { ReactComponent as ArrivalLocationFilledSVG } from '#/assets/svgs/arrival-filled.svg';

interface StepsProps {
  transport: Transport | undefined;
  onPressStep: (index: number) => void;
  index: number;
  allowGenerateTrackingLink?: boolean;
  onAddressClick: (coordinates: Coordinates) => void;
}

export function Steps({
  index,
  transport,
  onPressStep,
  allowGenerateTrackingLink,
  onAddressClick,
}: StepsProps) {
  const { t } = useTypeSafeTranslation();

  const formattedItem = {
    id: transport?.id,
    mode: transport?.mode,
    status: transport?.status,
  };

  return (
    <div data-testid="step-transport" key={index}>
      <div
        className={twMerge(
          `flex w-fit items-center rounded-full pr-1`,
          transport?.status && getColorByStatus(transport.status).bg,
        )}
        key={index}
        onClick={() => {
          onPressStep(index);
          isMobile && scrollToMap();
        }}
      >
        <Typography.Text
          className={twMerge(
            `mb-0 flex h-10 w-10 items-center justify-center rounded-full text-base text-white ring-1 ring-white`,
            transport?.status && getColorByStatus(transport.status).indexBg,
          )}
        >
          {index + 1}
        </Typography.Text>
        <Typography.Text
          className={twMerge(
            `cursor-pointer pl-3 pr-4 capitalize`,
            transport?.status && getColorByStatus(transport.status).text,
          )}
          strong
        >
          {transport?.title}
        </Typography.Text>
        <ChangeStatusButton item={formattedItem} />
      </div>

      <div className="my-3 ml-4 space-y-3 border-l-2 border-dashed border-grey-primary-200 pl-5">
        {transport?.arrival &&
          transport.departure &&
          transport.arrival.address &&
          transport.departure.address &&
          transport.id && (
            <div className="space-x-4">
              <GenerateButton
                allowGenerateTrackingLink={allowGenerateTrackingLink}
                arrivalName={transport.arrival.address}
                departureName={transport.departure.address}
                placeOfArrival={`${transport.arrival.lat},${transport.arrival.lng}`}
                placeOfDeparture={`${transport.departure.lat},${transport.departure.lng}`}
                transport={transport}
                transportId={transport.id}
              />
            </div>
          )}
        <div className="space-y-1">
          <Dots
            icon={
              <DepartureLocationFilledSVG
                className="text-default-info"
                height={22}
                width={22}
              />
            }
            label={t('commonFields.departure')}
          />
          <ContactItem
            label={t('commonFields.dateAndTime')}
            value={
              transport?.departure?.date
                ? formatDateWithHour(
                    String(convertStringToUTC(transport.departure.date)),
                    DATE_FORMAT_FULL,
                  )
                : 'N/A'
            }
          />
          {transport?.departure?.address ? (
            <div
              className="cursor-pointer"
              {...(transport.departure.lat &&
                transport.departure.lng && {
                  onClick: () => {
                    onAddressClick({
                      lat: transport.departure?.lat || 0,
                      lng: transport.departure?.lng || 0,
                    });
                    isMobile && scrollToMap();
                  },
                })}
            >
              <ContactItem
                className="font-semibold text-primary"
                label={t('commonFields.address')}
                value={transport.departure.address}
              />
            </div>
          ) : (
            <ContactItem label={t('commonFields.address')} value="N/A" />
          )}
        </div>

        <div className="space-y-2">
          <Dots
            icon={
              <ArrivalLocationFilledSVG
                className="text-error"
                height={22}
                width={22}
              />
            }
            label={t('commonFields.arrival')}
          />
          <ContactItem
            label={t('commonFields.dateAndTime')}
            value={
              transport?.arrival?.date
                ? formatDateWithHour(
                    String(convertStringToUTC(transport.arrival.date)),
                    DATE_FORMAT_FULL,
                  )
                : 'N/A'
            }
          />

          {transport?.arrival?.address ? (
            <div
              className="cursor-pointer"
              {...(transport.arrival.lat &&
                transport.arrival.lng && {
                  onClick: () => {
                    onAddressClick({
                      lat: transport.arrival?.lat || 0,
                      lng: transport.arrival?.lng || 0,
                    });
                    isMobile && scrollToMap();
                  },
                })}
            >
              <ContactItem
                className="font-semibold text-primary"
                label={t('commonFields.address')}
                value={transport.arrival.address}
              />
            </div>
          ) : (
            <ContactItem label={t('commonFields.address')} value="N/A" />
          )}
        </div>
      </div>
    </div>
  );
}
