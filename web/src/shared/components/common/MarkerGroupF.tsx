import type { MarkerProps } from '@react-google-maps/api';
import { MarkerF, PolylineF } from '@react-google-maps/api';
import type { MarkerGroup } from '#/shared/utils/type';
import type { ServiceType } from '#/shared/utils/type/services';
import SingleMarker from '#/assets/svgs/single-marker-filled.svg';

interface MarkerGroupFProps {
  markerGroup: MarkerGroup;
  clusterer: MarkerProps['clusterer'] & { markers: ServiceType[] };
  showGroup?: boolean;
  onChangeShowGroup?: (value: boolean) => void;
  onMarkerClick?: (marker: ServiceType) => void;
  children?: React.ReactNode | React.ReactNode[];
}

export default function MarkerGroupF({
  markerGroup,
  clusterer,
  showGroup,
  onChangeShowGroup,
  onMarkerClick,
  children,
}: MarkerGroupFProps) {
  return (
    <div>
      {showGroup ? (
        <MarkerF
          clusterer={clusterer}
          icon={SingleMarker}
          key={markerGroup.index}
          label={{ color: 'white', text: `${markerGroup.children.length}` }}
          onClick={() => onChangeShowGroup?.(!showGroup)}
          position={{
            lat: markerGroup.lat || 0,
            lng: markerGroup.lng || 0,
          }}
          title="center"
        >
          {children}
        </MarkerF>
      ) : (
        markerGroup.children.map((_, index) => (
          <MarkerF
            clusterer={clusterer}
            icon={SingleMarker}
            key={String(index)}
            label={{ color: 'white', text: `${markerGroup.children.length}` }}
            onClick={() => onChangeShowGroup?.(!showGroup)}
            position={{
              lat: markerGroup.lat || 0,
              lng: markerGroup.lng || 0,
            }}
          />
        ))
      )}
      <>
        {showGroup && (
          <>
            {markerGroup.children.map(marker => (
              <MarkerF
                clusterer={clusterer}
                key={marker.index}
                label={{ color: 'white', text: `${marker.index + 1}` }}
                onClick={() => onMarkerClick?.(marker)}
                position={{ lat: marker.lat || 0, lng: marker.lng || 0 }}
              />
            ))}
            {markerGroup.children.map(child => (
              <PolylineF
                key={child.index}
                options={{
                  geodesic: true,
                  icons: [
                    {
                      icon: {
                        fillOpacity: 1,
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 1.4,
                      },
                      offset: '0',
                      repeat: '10px',
                    },
                  ],
                  strokeColor: 'red',
                  strokeOpacity: 0,
                  strokeWeight: 1,
                }}
                path={[
                  { lat: child.lat ?? 0, lng: child.lng ?? 0 },
                  { lat: markerGroup.lat ?? 0, lng: markerGroup.lng ?? 0 },
                ]}
                visible={showGroup}
              />
            ))}
          </>
        )}
      </>
    </div>
  );
}
