import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showError } from '@enouvo/react-uikit';
import { isMobile } from 'react-device-detect';
import MapModal from '../transportation/MapModal';
import SectionLayout from '../layouts/SectionLayout';
import { FormalitiesDetail } from './FormalitiesDetail';
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

export function FormalitiesContainer() {
  const { i18n: i18nState } = useTranslation();
  const navigate = useNavigate();
  const email = getEmail();
  const caseName = getCaseName();
  const { visible } = useSectionLayoutGoogleMapVisible();
  const [map, setMap] = useState<google.maps.Map>();

  const { data, error, isLoading } = useQuery({
    keepPreviousData: true,
    onError: showError,
    queryFn: () => getServices({ email, name: caseName }),
    queryKey: [SectionId.Formalities, i18nState.language, email, caseName],
    refetchOnMount: 'always',
    retryOnMount: true,
  });

  const formalities: ServiceType[] = useMemo(() => {
    const formalData = data?.data.objects.filter(
      (service: ServicesDataFormatted) => service.step,
    );

    const formalities = formalData?.sort(
      (service1: ServicesDataFormatted, service2: ServicesDataFormatted) =>
        service1.id - service2.id,
    );

    const formattedData = formalities
      ? normalizeFuneralServiceData(formalities)
      : [];
    return formattedData;
  }, [data]);

  const onPressStep = (index: number) => {
    const { lat, lng } = formalities[index];
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
    <SectionLayout isEmpty={!formalities[0]} loading={isLoading && !error}>
      {formalities.length > 0 && (
        <div className="flex h-full w-full md:flex-col-reverse md:px-4 lg:gap-x-2">
          <div className="h-full w-1/2 overflow-y-auto md:w-full">
            <FormalitiesDetail
              formalitiesData={formalities}
              onAddressClick={onAddressClick}
              onPressStep={onPressStep}
            />
          </div>
          <div className="h-full w-1/2 md:mb-6 md:h-60 md:w-full">
            {visible && (
              <Map
                map={map}
                markers={formalities}
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
            markers={formalities}
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
