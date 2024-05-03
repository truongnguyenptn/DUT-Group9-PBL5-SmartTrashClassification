import { useReactiveVar } from '@apollo/client';
import { useCallback, useRef } from 'react';
import { directionResponseCacheData } from '#/graphql/cache';

interface DirectionsArgs {
  placeOfArrival: string;
  placeOfDeparture: string;
}

export default function useDirectionResponseCacheData() {
  const cacheData = useReactiveVar(directionResponseCacheData);
  const cacheDataRef = useRef<typeof cacheData>(cacheData);

  const constructKey = ({ placeOfArrival, placeOfDeparture }: DirectionsArgs) =>
    `directions-cache-response-${placeOfArrival}-${placeOfDeparture}`;

  const appendNewData = useCallback(
    ({
      placeOfArrival,
      placeOfDeparture,
      response,
    }: DirectionsArgs & {
      response: google.maps.DirectionsResult;
    }) => {
      const updatedData = {
        ...(cacheDataRef.current ?? {}),
        ...{
          [constructKey({ placeOfArrival, placeOfDeparture })]: response,
        },
      };

      cacheDataRef.current = updatedData;
      directionResponseCacheData(updatedData);
    },
    [],
  );

  const getCacheResponse = useCallback(
    ({ placeOfArrival, placeOfDeparture }: DirectionsArgs) =>
      cacheData?.[constructKey({ placeOfArrival, placeOfDeparture })],
    [cacheData],
  );

  return {
    appendNewData,
    cacheData,
    getCacheResponse,
  };
}
