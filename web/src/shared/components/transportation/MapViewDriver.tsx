import {
  DirectionsRenderer,
  GoogleMap,
  MarkerClustererF,
  MarkerF,
  MarkerProps,
  PolylineF,
} from '@react-google-maps/api';
import {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import last from 'lodash-es/last';
import { Button, Spin } from 'antd';
import { Simplify } from 'simplify-ts';
import { AimOutlined } from '@ant-design/icons';
import LoadingScreen from '../common/LoadingScreen';
import { TravelMode } from '#/shared/utils/type';
import { Coordinates } from '#/shared/utils/type/transportation';
import DepartureFilled from '#/assets/images/departureFilled.png';
import ArrivalFilled from '#/assets/images/arrivalFilled.png';
import { ReactComponent as CarFilledSVG } from '#/assets/svgs/car-filled.svg';
import CarCircleSVG from '#/assets/svgs/car-circle.svg';
import { TrackingLocation } from '#/generated/schemas';
import useGoogleMaps from '#/shared/hooks/useGoogleMap';
import useDirectionResponseCacheData from '#/shared/hooks/useDirectionResponseCacheData';

export interface MapViewDetailProps {
  placeOfArrival: string;
  placeOfArrivalAddress: string;
  placeOfDeparture: string;
  placeOfDepartureAddress: string;
  driverDirections?: TrackingLocation[];
  setMap?: Dispatch<SetStateAction<google.maps.Map | undefined>>;
  map?: google.maps.Map;
  onMapLoaded?: () => void;
}

const driverDirectionPolylineOptions = {
  geodesic: true,
  strokeColor: '#078E8C',
  strokeWeight: 2,
};

export function MapViewDetail({
  placeOfArrival,
  placeOfDeparture,
  driverDirections,
  map,
  setMap,
  placeOfArrivalAddress,
  placeOfDepartureAddress,
  onMapLoaded,
}: MapViewDetailProps) {
  const { createInfoWindow, getDirection } = useGoogleMaps();
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isSetResponse = useRef(false);

  const { appendNewData, getCacheResponse } = useDirectionResponseCacheData();

  const infoWindowRef = useRef<google.maps.InfoWindow>();
  const arrivalMarkerRef = useRef<google.maps.Marker>();
  const departureMarkerRef = useRef<google.maps.Marker>();
  const departureInfoWindowContentRef = useRef<HTMLDivElement>(null);
  const arrivalInfoWindowContentRef = useRef<HTMLDivElement>(null);

  const [departureLat, departureLng] = placeOfDeparture.split(',');
  const [arrivalLat, arrivalLng] = placeOfArrival.split(',');

  const simplifiedDirection = useMemo(() => {
    if (driverDirections) {
      const simplifiedPoints = Simplify(
        driverDirections.map(point => ({
          x: Number(point.latitude),
          y: Number(point.longitude),
        })),
        0.00015,
        true,
      );
      return simplifiedPoints.map(point => ({ lat: point.x, lng: point.y }));
    }
    return [];
  }, [driverDirections]);

  const driverCurrentPosition = last(driverDirections);
  const driverStartPosition = driverDirections?.[0];

  const directionStartPoint = useMemo(() => {
    const firstOverviewPoint = directionResponse?.routes[0]?.overview_path[0];
    return {
      lat: firstOverviewPoint?.lat(),
      lng: firstOverviewPoint?.lng(),
    };
  }, [directionResponse?.routes]);

  const directionEndPoint = useMemo(() => {
    const lastOverviewPoint = last(directionResponse?.routes[0]?.overview_path);
    return {
      lat: lastOverviewPoint?.lat(),
      lng: lastOverviewPoint?.lng(),
    };
  }, [directionResponse?.routes]);

  useEffect(() => {
    (async () => {
      if (isMapLoaded) {
        const infoWindow = await createInfoWindow();
        infoWindowRef.current = infoWindow;
      }
    })();
  }, [createInfoWindow, isMapLoaded]);

  useEffect(() => {
    if (!isSetResponse.current) {
      isSetResponse.current = true;

      const cachedDirectionResponse = getCacheResponse({
        placeOfArrival,
        placeOfDeparture,
      });

      if (cachedDirectionResponse) {
        setDirectionResponse(cachedDirectionResponse);
        setTimeout(() => {
          setIsMapLoaded(true);
          onMapLoaded?.();
        }, 1500);
      } else {
        (async () => {
          getDirection(
            {
              destination: placeOfArrival,
              origin: placeOfDeparture,
              travelMode: TravelMode.DRIVING,
            },
            // wait until map successfully loaded into view (1.5ms)
            response => {
              setTimeout(() => {
                setIsMapLoaded(true);
                onMapLoaded?.();
              }, 1500);

              if (response) {
                setDirectionResponse(response);
                appendNewData({
                  placeOfArrival,
                  placeOfDeparture,
                  response,
                });
              }
            },
          );
        })();
      }
    }
  }, [
    appendNewData,
    getCacheResponse,
    getDirection,
    onMapLoaded,
    placeOfArrival,
    placeOfDeparture,
  ]);

  const renderMarker = (
    position: string,
    markerProps?: Omit<MarkerProps, 'position'>,
  ) => {
    const [lat, lng] = position.split(',');

    return (
      lat &&
      lng && (
        <MarkerF
          position={{ lat: Number(lat), lng: Number(lng) }}
          {...markerProps}
        />
      )
    );
  };

  const renderPolyline = (
    path: Coordinates[],
    options?: google.maps.PolylineOptions,
  ) => <PolylineF options={options} path={path} />;

  const suggestPolylineOptions = {
    geodesic: true,
    icons: [
      {
        icon: {
          fillOpacity: 1,
          path: google.maps.SymbolPath.CIRCLE,
          scale: 1.4,
        },
        offset: '0',
        repeat: '5px',
      },
    ],
    strokeColor: 'grey',
    strokeOpacity: 0,
    strokeWeight: 2,
  };

  if (!(placeOfArrival && placeOfDeparture)) return <LoadingScreen />;

  return directionResponse ? (
    <GoogleMap
      mapContainerStyle={{
        height: '100%',
        width: '100%',
      }}
      onLoad={map => {
        setMap?.(map);
      }}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
      }}
      zoom={10}
    >
      {departureLat &&
        departureLng &&
        directionStartPoint.lat &&
        directionStartPoint.lng &&
        renderPolyline(
          [
            { lat: Number(departureLat), lng: Number(departureLng) },
            {
              lat: Number(directionStartPoint.lat),
              lng: Number(directionStartPoint.lng),
            },
          ],
          suggestPolylineOptions,
        )}
      {arrivalLat &&
        arrivalLng &&
        directionEndPoint.lat &&
        directionEndPoint.lng &&
        renderPolyline(
          [
            { lat: Number(arrivalLat), lng: Number(arrivalLng) },
            {
              lat: Number(directionEndPoint.lat),
              lng: Number(directionEndPoint.lng),
            },
          ],
          suggestPolylineOptions,
        )}
      {simplifiedDirection[0] &&
        renderPolyline(simplifiedDirection, driverDirectionPolylineOptions)}
      {placeOfDeparture && placeOfArrival && (
        <MarkerClustererF>
          {() => (
            <>
              {renderMarker(placeOfDeparture, {
                icon: DepartureFilled,
                onClick() {
                  infoWindowRef.current?.setPosition({
                    lat: Number(departureLat),
                    lng: Number(departureLng),
                  });
                  infoWindowRef.current?.setContent(
                    departureInfoWindowContentRef.current,
                  );
                  infoWindowRef.current?.open(map, departureMarkerRef.current);
                  map?.setCenter({
                    lat: Number(departureLat),
                    lng: Number(departureLng),
                  });
                },
                onLoad(marker) {
                  departureMarkerRef.current = marker;
                },
              })}
              {renderMarker(placeOfArrival, {
                icon: ArrivalFilled,
                onClick() {
                  infoWindowRef.current?.setPosition({
                    lat: Number(arrivalLat),
                    lng: Number(arrivalLng),
                  });
                  infoWindowRef.current?.setContent(
                    arrivalInfoWindowContentRef.current,
                  );
                  infoWindowRef.current?.open(map, arrivalMarkerRef.current);
                  map?.setCenter({
                    lat: Number(arrivalLat),
                    lng: Number(arrivalLng),
                  });
                },
                onLoad(marker) {
                  arrivalMarkerRef.current = marker;
                },
              })}
              <div className="hidden">
                <div
                  className="text-center font-semibold"
                  id="arrival-info-window-content"
                  ref={arrivalInfoWindowContentRef}
                >
                  <a
                    className="text-xs text-gray-800"
                    href={`https://www.google.com/maps/search/?api=1&query=${placeOfArrivalAddress}`}
                    target="__blank"
                  >
                    <AimOutlined />
                    {` ${placeOfArrivalAddress}`}
                  </a>
                </div>
                <div
                  className="text-center font-semibold"
                  id="departure-info-window-content"
                  ref={departureInfoWindowContentRef}
                >
                  <a
                    className="text-xs text-gray-800"
                    href={`https://www.google.com/maps/search/?api=1&query=${placeOfDepartureAddress}`}
                    target="__blank"
                  >
                    <AimOutlined />
                    {` ${placeOfDepartureAddress}`}
                  </a>
                </div>
              </div>
            </>
          )}
        </MarkerClustererF>
      )}
      {driverCurrentPosition && driverStartPosition && (
        <MarkerClustererF>
          {() => (
            <>
              {renderMarker(
                [
                  driverStartPosition.latitude,
                  driverStartPosition.longitude,
                ].join(','),
                {
                  icon: {
                    scaledSize: new google.maps.Size(30, 30),
                    url: CarCircleSVG,
                  },
                },
              )}
              {renderMarker(
                [
                  driverCurrentPosition.latitude,
                  driverCurrentPosition.longitude,
                ].join(','),
                {
                  icon: DepartureFilled,
                },
              )}
            </>
          )}
        </MarkerClustererF>
      )}
      <DirectionsRenderer
        options={{
          directions: directionResponse,
          polylineOptions: {
            strokeColor: '#3765DE',
            strokeWeight: 4,
          },
          suppressMarkers: true,
        }}
      />
      {driverStartPosition && isMapLoaded && (
        <Button
          className="absolute bottom-28 right-0 m-[0.64rem] h-min w-min border-none p-2 text-purple md:bottom-4 md:left-0"
          onClick={() => {
            map?.setCenter({
              lat: Number(driverStartPosition.latitude),
              lng: Number(driverStartPosition.longitude),
            });
            map?.setZoom(15);
          }}
        >
          <CarFilledSVG height={24} width={24} />
        </Button>
      )}
    </GoogleMap>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Spin />
    </div>
  );
}

export default memo(MapViewDetail);
