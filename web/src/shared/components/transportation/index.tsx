/* eslint-disable @typescript-eslint/no-use-before-define */
import { useQuery } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showError } from '@enouvo/react-uikit';
import { isMobile } from 'react-device-detect';
import SectionLayout from '../layouts/SectionLayout';
import { TransportationDetail } from './TransportationDetail';
import MapModal from './MapModal';
import {
  normalizeTransportationData,
  normalizeTransportationDataMaker,
} from '#/shared/utils/transportation';
import Map from '#/shared/components/common/Map';
import { getTransportation } from '#/api/transportation';

import {
  QueryOperator,
  useGetTrackingDriversLazyQuery,
} from '#/generated/schemas';
import { getCaseName, getEmail } from '#/shared/utils/localStorage';
import { SectionId } from '#/shared/utils/type';
import type { ServiceType } from '#/shared/utils/type/services';
import type {
  Transport,
  TransportDataFormatted,
} from '#/shared/utils/type/transportation';
import { Coordinates } from '#/shared/utils/type/transportation';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';

export default function TransportationContainer() {
  const { i18n: i18nState } = useTranslation();
  // const email = getEmail();
  // const caseName = getCaseName();
  const email = "ok@gmail"
  const navigate = useNavigate();
  const [transports, setTransports] = useState<Transport[] | undefined>(
    undefined,
  );
  const { visible } = useSectionLayoutGoogleMapVisible();
  const [map, setMap] = useState<google.maps.Map>();

  const [
    getTrackingDrivers,
    { data: trackingDriverData, loading, error: getTrackingDriversError },
  ] = useGetTrackingDriversLazyQuery({
    fetchPolicy: 'network-only',
  });

  const {
    data: getTransportationData,
    isLoading,
    error: getTransportError,
  } = useQuery({
    keepPreviousData: true,
    onError: showError,
    onSuccess: () => {
      email &&
        caseName &&
        getTrackingDrivers({
          variables: {
            providerEmail: email,
            queryParams: {
              filters: [
                {
                  data: caseName,
                  field: 'TrackingDriver.caseName',
                  operator: QueryOperator.Eq,
                },
              ],
              limit: 100,
            },
          },
        });
    },
    queryFn: () => getTransportation({ email, name: caseName }),
    queryKey: [SectionId.Transportation, i18nState.language, email, caseName],
    refetchOnMount: 'always',
    retryOnMount: true,
    staleTime: 5000,
  });

  useEffect(() => {
    if (!getTrackingDriversError) {
      const normalizedTransportationData: TransportDataFormatted[] =
        getTransportationData?.data.objects
          ? normalizeTransportationData(getTransportationData.data.objects)
          : [];
      const trackingDrivers = trackingDriverData?.getTrackingDrivers.items;

      setTransports(
        normalizedTransportationData.map(item => {
          const foundTrackingDriverRecord = trackingDrivers?.find(
            trackingDriver => trackingDriver.transportId === item.id,
          );
          return foundTrackingDriverRecord
            ? { ...item, trackingDriver: foundTrackingDriverRecord }
            : item;
        }),
      );
    }
  }, [
    getTrackingDriversError,
    getTransportationData?.data.objects,
    trackingDriverData?.getTrackingDrivers.items,
  ]);

  const transportationMarkersData: ServiceType[] = useMemo(() => {
    const formatMaker = getTransportationData?.data.objects
      ? normalizeTransportationDataMaker(getTransportationData.data.objects)
      : [];
    const markers = formatMaker.length > 0 ? flatten(formatMaker) : [];
    return markers;
  }, [getTransportationData]);

  const onPressStep = (index: number) => {
    const { lat, lng } = transportationMarkersData[index];
    if (lat && lng) {
      map?.setCenter({
        lat,
        lng,
      });
    }
  };

  const onCloseMapModal = () => {
    navigate({ hash: '' });
  };

  const onAddressClick = (coordinates: Coordinates) => {
    const { lat, lng } = coordinates;
    if (lat && lng) {
      map?.setCenter({
        lat,
        lng,
      });
    }
  };

  return (
    <SectionLayout
      isEmpty={!transports?.[0]}
      loading={
        (!transports || isLoading || loading) &&
        !getTrackingDriversError &&
        !getTransportError
      }
    >
      {(transports?.length ?? 0) > 0 && (
        <div className="flex h-full w-full md:flex-col-reverse md:px-4 lg:gap-x-2">
          <div className="h-full w-1/2 overflow-y-auto pr-2 md:w-full">
            <TransportationDetail
              onAddressClick={onAddressClick}
              onPressStep={onPressStep}
              transports={transports ?? []}
            />
          </div>
          <div className="h-full w-1/2 md:mb-6 md:h-60 md:w-full">
            {visible && (
              <Map
                map={map}
                markers={transportationMarkersData}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  zoomControl: !isMobile,
                }}
                setMap={setMap}
              />
            )}
          </div>

          <MapModal
            closeMapModal={onCloseMapModal}
            markers={transportationMarkersData}
            options={{
              center: {
                lat: Number(map?.getCenter()?.lat()),
                lng: Number(map?.getCenter()?.lng()),
              },
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: !isMobile,
            }}
            setMap={setMap}
          />
        </div>
      )}
    </SectionLayout>
  );
}
