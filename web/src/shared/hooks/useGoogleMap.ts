import { useCallback, useRef } from 'react';

export default function useGoogleMaps() {
  const mapRef = useRef<google.maps.Map>();

  const initMap = useCallback(
    async (elementId: string, options: google.maps.MapOptions) => {
      const element = document.getElementById(elementId);
      if (element) {
        mapRef.current = new google.maps.Map(element, options);
      }
      return null;
    },
    [],
  );

  const getDirection = useCallback(
    async (
      request: google.maps.DirectionsRequest,
      callback?: (
        a: google.maps.DirectionsResult | null,
        b: google.maps.DirectionsStatus,
      ) => void,
    ) => {
      const direction = new google.maps.DirectionsService();
      direction.route(request, callback);
    },
    [],
  );

  async function createInfoWindow(options?: google.maps.InfoWindowOptions) {
    const infoWindow = new google.maps.InfoWindow(options);

    return infoWindow;
  }

  const getRecommendPlaces = useCallback(
    async (
      request: google.maps.places.AutocompletionRequest,
      callback?: (
        a: google.maps.places.AutocompletePrediction[] | null,
        b: google.maps.places.PlacesServiceStatus,
      ) => void,
    ) => {
      const autocomplete = new google.maps.places.AutocompleteService();
      autocomplete.getPlacePredictions({ ...request }, callback);
    },
    [],
  );

  const getGeology = useCallback(
    async (
      request: google.maps.GeocoderRequest,
      callback?:
        | null
        | ((
            a: null | google.maps.GeocoderResult[],
            b: google.maps.GeocoderStatus,
          ) => void),
    ) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(request, callback);
    },
    [],
  );

  return {
    createInfoWindow,
    getDirection,
    getGeology,
    getRecommendPlaces,
    initMap,
    map: mapRef.current,
  };
}
