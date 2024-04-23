import { Typography, Image as AntdImage, Spin, Button } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ContactItem } from '../common/ContactItem';
import Dots from '../common/Dots';
import LoadingScreen from '../common/LoadingScreen';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type {
  Coordinates,
  Transport,
} from '#/shared/utils/type/transportation';
import Image from '#/shared/components/common/Image';
import { convertStringToUTC } from '#/shared/utils/tool';
import {
  DATE_FORMAT_FULL,
  HASH_MAP_DRIVER_VIEW,
  STATUS,
} from '#/shared/utils/constant';
import { ReactComponent as DepartureLocationFilledSVG } from '#/assets/svgs/departure-filled.svg';
import { ReactComponent as ArrivalLocationFilledSVG } from '#/assets/svgs/arrival-filled.svg';
import { ReactComponent as ZoomInOutlineSVG } from '#/assets/svgs/zoom-in-outline.svg';
import { formatDateWithHour } from '#/shared/utils/date';
import { useGetTrackingLocationsQuery } from '#/generated/schemas';
import MapViewDriver from '#/shared/components/transportation/MapViewDriver';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';
import { ReactComponent as ZoomOutlineSVG } from '#/assets/svgs/zoom-outline.svg';

interface ViewDetailsModalProps {
  transport?: Transport;
  loading?: boolean;
}

export default function ViewTrackingDriverDetails({
  transport,
  loading,
}: ViewDetailsModalProps) {
  const { t } = useTypeSafeTranslation();
  const [map, setMap] = useState<google.maps.Map>();
  const [fullScreen, setFullScreen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { hash } = useLocation();
  const { onHide } = useSectionLayoutGoogleMapVisible();

  useEffect(() => {
    // Disable rendering other map while ViewTrackingDriverDetails is rendering to prevent crash web
    onHide();
  }, [onHide]);

  const statusDriverColor = STATUS.find(
    statusDriverColor =>
      statusDriverColor.value === transport?.trackingDriver?.status,
  )?.color;

  const statusDriverBackground = STATUS.find(
    statusDriverColor =>
      statusDriverColor.value === transport?.trackingDriver?.status,
  )?.bg;

  const foundStatus = STATUS.find(
    status => status.value === transport?.trackingDriver?.status,
  );

  const { data } = useGetTrackingLocationsQuery({
    fetchPolicy: 'network-only',
    skip: !transport?.trackingDriver?.id,
    variables: {
      queryParams: {},
      trackingDriverId: String(transport?.trackingDriver?.id),
    },
  });

  const onAddressClick = (address: Coordinates) => {
    const { lat, lng } = address;
    if (lat && lng) {
      map?.setCenter({
        lat,
        lng,
      });
    }
    map?.setZoom(40);
  };

  const onMapLoaded = useCallback(() => setIsMapLoaded(true), []);

  return (
    <>
      {(!transport?.trackingDriver || loading) && <LoadingScreen />}
      <div className="relative flex h-full w-full gap-x-4 md:flex-col-reverse md:px-2">
        <div className="h-full w-1/2 overflow-y-auto pl-2 md:w-full">
          <Typography.Title level={4}>
            {t('transportation.tripInformation')}
          </Typography.Title>
          <div className="my-3 flex min-h-[4rem] w-full items-center justify-between rounded-lg border-2 border-grey-primary-200 p-4">
            <div className="flex items-center space-x-4">
              <div>
                <Typography.Text className="text-base" strong>
                  {transport?.title}
                </Typography.Text>
              </div>
              <Typography.Text
                className={twMerge(
                  'flex min-w-[7rem] cursor-pointer items-center justify-center rounded-3xl px-4 py-2 font-medium',
                  statusDriverBackground,
                  statusDriverColor,
                )}
              >
                {foundStatus?.title ? t(foundStatus.title) : ''}
              </Typography.Text>
            </div>
          </div>

          <div className="my-3 space-y-4 rounded-lg border-2 border-grey-primary-200 p-4">
            <div className="space-y-4">
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
              {transport?.trackingDriver?.departurePhotoKey && (
                <div className="flex flex-row flex-wrap gap-x-2">
                  <AntdImage.PreviewGroup preview={{ transitionName: '' }}>
                    {transport.trackingDriver.departurePhotoKey.map(photo => (
                      <div key={photo}>
                        <Image
                          className="rounded"
                          height={64}
                          src={photo}
                          width={64}
                        />
                      </div>
                    ))}
                  </AntdImage.PreviewGroup>
                </div>
              )}
            </div>

            <div className="space-y-4">
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
              {transport?.trackingDriver?.arrivePhotoKey && (
                <div className="flex flex-row flex-wrap gap-x-2">
                  <AntdImage.PreviewGroup preview={{ transitionName: '' }}>
                    {transport.trackingDriver.arrivePhotoKey.map(photo => (
                      <div key={photo}>
                        <Image
                          className="rounded"
                          height={64}
                          src={photo}
                          width={64}
                        />
                      </div>
                    ))}
                  </AntdImage.PreviewGroup>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-auto w-1/2 overflow-visible rounded-lg md:mb-4 md:h-[17rem] md:w-full xs:h-80">
          {data?.getTrackingLocations.items &&
          !hash.includes(HASH_MAP_DRIVER_VIEW) ? (
            <div
              className={twMerge(
                'h-full w-full',
                fullScreen && 'absolute right-0 top-0',
              )}
            >
              <MapViewDriver
                driverDirections={data.getTrackingLocations.items}
                map={map}
                onMapLoaded={onMapLoaded}
                placeOfArrival={
                  transport?.trackingDriver?.placeOfArrival ?? '0, 0'
                }
                placeOfArrivalAddress={transport?.arrival?.address ?? ''}
                placeOfDeparture={
                  transport?.trackingDriver?.placeOfDeparture ?? '0, 0'
                }
                placeOfDepartureAddress={transport?.departure?.address ?? ''}
                setMap={setMap}
              />
              {isMapLoaded && (
                <Button
                  className="absolute right-[0.625rem] top-[0.625rem] flex h-10 w-10 items-center justify-center border-none md:right-[1.125rem]"
                  htmlType="submit"
                  icon={
                    fullScreen ? (
                      <ZoomInOutlineSVG className="h-6 w-6 text-grey-primary-500" />
                    ) : (
                      <ZoomOutlineSVG className="h-6 w-6 text-grey-primary-500" />
                    )
                  }
                  onClick={() => setFullScreen(prev => !prev)}
                />
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spin />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
