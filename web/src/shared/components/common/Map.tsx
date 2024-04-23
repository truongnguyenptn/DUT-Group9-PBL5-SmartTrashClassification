import {
  GoogleMap,
  InfoWindowF,
  MarkerClustererF,
  MarkerF,
  PolylineF,
} from '@react-google-maps/api';
import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Grid } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import MarkerGroupF from './MarkerGroupF';
import type { ServiceType } from '#/shared/utils/type/services';
import type { MarkerGroup } from '#/shared/utils/type';
import { getSurroundMarkerPosition } from '#/shared/utils/tool';
import { ReactComponent as ZoomOutlineSVG } from '#/assets/svgs/zoom-outline.svg';
import { HASH_MAP_VIEW } from '#/shared/utils/constant';
import SingleMarker from '#/assets/svgs/single-marker-filled.svg';
import { useSectionLayoutGoogleMapVisible } from '#/shared/hooks/useRenderSectionLayoutGoogleMap';

export const makePolyline = (markers: ServiceType[]) =>
  markers.map(e => {
    const newLongLat: google.maps.LatLngLiteral = {
      lat: e.lat || 0,
      lng: e.lng || 0,
    };
    return newLongLat;
  });
export interface MapProps {
  markers: ServiceType[];
  options?: google.maps.MapOptions;
  setMap?: Dispatch<SetStateAction<google.maps.Map | undefined>>;
  map?: google.maps.Map;
}

function Map({
  markers,
  options = { fullscreenControl: false },
  setMap,
  map,
  ...rest
}: MapProps) {
  const navigate = useNavigate();
  const { xs } = Grid.useBreakpoint();
  const { hash } = useLocation();
  const [selectedMarker, setSelectedMarker] = useState<ServiceType | undefined>(
    undefined,
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { onHide } = useSectionLayoutGoogleMapVisible();

  const onOpenMapModal = () => {
    onHide();
    navigate({ hash: HASH_MAP_VIEW });
  };
  const [showGroup, setShowGroup] = useState(true);
  const isSetDefault = useRef(false);

  const formattedMarkers: ServiceType[] = useMemo(
    () => markers.filter(({ lat, lng }) => lat && lng),
    [markers],
  );

  const markerGroups: MarkerGroup[] = useMemo(() => {
    let returnedGroups: MarkerGroup[] = [];

    markers.forEach((marker, index) => {
      const foundGroup = returnedGroups.find(
        group => group.lat === marker.lat && group.lng === marker.lng,
      );

      if (foundGroup) {
        returnedGroups = returnedGroups.map(group =>
          group.lat === foundGroup.lat && group.lng && foundGroup.lng
            ? {
                ...group,
                children: [...group.children, { ...marker, index }],
              }
            : group,
        );
      } else {
        returnedGroups.push({
          children: [{ ...marker, index }],
          ...marker,
          index,
        });
      }
    });
    return returnedGroups.map(group =>
      group.children.length > 1
        ? {
            ...group,
            children: group.children.map((child, i) => ({
              ...child,
              ...getSurroundMarkerPosition({
                center: { lat: group.lat ?? 0, lng: group.lng ?? 0 },
                index: i,
                totalPoints: group.children.length,
              }),
            })),
          }
        : group,
    );
  }, [markers]);

  const path: google.maps.LatLngLiteral[] =
    formattedMarkers.length > 0 ? makePolyline(formattedMarkers) : [];

  useEffect(() => {
    /*
     * React 18's strict mode first run a useEffect twice which lets the Google Maps to work properly
     * On production environment, we don't have Strict mode so that we must use setTimeout to let the Google Maps set its default center after 100ms
     */

    let timer: NodeJS.Timeout;
    if (!isSetDefault.current && map) {
      timer = setTimeout(() => {
        map.setCenter({
          lat: markers[0]?.lat ?? 0,
          lng: markers[0]?.lng ?? 0,
        });
        setIsMapLoaded(true);
        isSetDefault.current = true;
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [map, markers]);

  const infoWindow = !!selectedMarker && (
    <InfoWindowF
      onCloseClick={() => setSelectedMarker(undefined)}
      position={{
        lat: selectedMarker.lat ?? 0,
        lng: selectedMarker.lng ?? 0,
      }}
    >
      <div className="text-center font-semibold">
        <a
          className="text-xs text-gray-800 outline-none"
          href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.address}`}
          target="__blank"
        >
          <AimOutlined />
          {` ${selectedMarker.address}`}
        </a>
      </div>
    </InfoWindowF>
  );

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={{
        borderRadius: hash !== HASH_MAP_VIEW && xs ? '0.75rem' : '',
        height: '100%',
        width: '100%',
      }}
      onLoad={map => {
        setMap?.(map);
      }}
      options={options}
      zoom={17}
      {...rest}
    >
      <MarkerClustererF
        calculator={markers => ({
          index: 1,
          text: String(
            markers.filter(marker => marker.getTitle() !== 'center').length,
          ),
        })}
        imagePath={SingleMarker}
        maxZoom={19}
        onClick={() => setShowGroup(true)}
        onMouseOver={() => setShowGroup(false)}
      >
        {cluster => (
          <>
            {markerGroups.map((group, index) =>
              group.children.length > 1 ? (
                <MarkerGroupF
                  clusterer={cluster}
                  key={`${group.index + 1}`}
                  markerGroup={group}
                  onChangeShowGroup={value => {
                    setShowGroup(value);
                    group.lat &&
                      group.lng &&
                      map?.setCenter({
                        lat: group.lat,
                        lng: group.lng,
                      });
                  }}
                  onMarkerClick={() => {
                    setSelectedMarker(group);
                    group.lat &&
                      group.lng &&
                      map?.setCenter({
                        lat: group.lat,
                        lng: group.lng,
                      });
                  }}
                  showGroup={showGroup}
                >
                  {selectedMarker?.lat === group.lat &&
                    selectedMarker?.lng === group.lng &&
                    infoWindow}
                </MarkerGroupF>
              ) : (
                <MarkerF
                  clusterer={cluster}
                  key={index}
                  label={`${group.index + 1}`}
                  onClick={() => {
                    setSelectedMarker(group);
                    group.lat &&
                      group.lng &&
                      map?.setCenter({
                        lat: group.lat,
                        lng: group.lng,
                      });
                  }}
                  position={{ lat: group.lat || 0, lng: group.lng || 0 }}
                >
                  {selectedMarker?.lat === group.lat &&
                    selectedMarker?.lng === group.lng &&
                    infoWindow}
                </MarkerF>
              ),
            )}
          </>
        )}
      </MarkerClustererF>
      <PolylineF
        options={{
          geodesic: true,
          strokeColor: '#078E8C',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }}
        path={path}
      />
      {hash !== HASH_MAP_VIEW && isMapLoaded && (
        <Button
          className="absolute right-[0.625rem] top-[0.625rem] flex h-10 w-10 items-center justify-center border-none"
          htmlType="submit"
          icon={<ZoomOutlineSVG className="h-6 w-6 text-grey-primary-500" />}
          onClick={onOpenMapModal}
        />
      )}
    </GoogleMap>
  );
}

export default memo(Map);
