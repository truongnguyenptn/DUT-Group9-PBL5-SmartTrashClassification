import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showError } from '@enouvo/react-uikit';
import { isMobile } from 'react-device-detect';
import SectionLayout from '../layouts/SectionLayout';
import MapModal from '../transportation/MapModal';
import { FuneralServiceDetails } from './FuneralServiceDetails';
import { getServices } from '#/api/service';
import Map from '#/shared/components/common/Map';
import { getCaseName, getEmail } from '#/shared/utils/localStorage';
import { normalizeFuneralServiceData } from '#/shared/utils/service';
import { SectionId } from '#/shared/utils/type';
import type {
  ServicesDataFormatted,
  ServiceType,
} from '#/shared/utils/type/services';
import { Coordinates } from '#/shared/utils/type/transportation';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';

export default function FuneralServiceContainer() {
  const { i18n: i18nState } = useTranslation();
  const email = getEmail();
  const navigate = useNavigate();
  const caseName = getCaseName();
  const { visible } = useSectionLayoutGoogleMapVisible();
  const [map, setMap] = useState<google.maps.Map>();

  const { data, isLoading, error } = useQuery({
    keepPreviousData: true,
    onError: showError,
    queryFn: () => getServices({ email, name: caseName }),
    queryKey: [SectionId.FuneralService, i18nState.language, email, caseName],
    refetchOnMount: 'always',
    retryOnMount: true,
  });

  const funeralServicesData: ServiceType[] = useMemo(() => {
    const servicesData = data?.data.objects.filter(
      (service: ServicesDataFormatted) =>
        !service.step && service.profession_prestation?.type_ope !== null,
    );

    const formattedData = servicesData
      ? normalizeFuneralServiceData(servicesData)
      : [];

    const serviceData = formattedData.filter(
      service => Object.keys(service).length > 0,
    );

    return serviceData;
  }, [data]);

  const onPressStep = (index: number) => {
    const { lat, lng } = funeralServicesData[index];
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
      isEmpty={!funeralServicesData[0]}
      loading={(isLoading || !data) && !error}
    >
      {funeralServicesData.length > 0 && (
        <div className="flex h-full w-full md:flex-col-reverse md:px-4 lg:gap-x-2">
          <div className="h-full w-1/2 overflow-y-auto pl-[0.625rem] md:w-full">
            <FuneralServiceDetails
              funeralServicesData={funeralServicesData}
              onAddressClick={onAddressClick}
              onPressStep={onPressStep}
            />
          </div>
          <div className="h-full w-1/2 md:mb-6 md:h-60 md:w-full">
            {visible && (
              <Map
                map={map}
                markers={funeralServicesData}
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
            markers={funeralServicesData}
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
