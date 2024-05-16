import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";

const Routing = ({ map }) => {
  const mapInstance = useMap();

  useEffect(() => {
    const leafletElement = L..control({
      waypoints: [L.latLng(27.67, 85.316), L.latLng(27.68, 85.321)]
    }).addTo(mapInstance);

    return () => {
      mapInstance.removeControl(leafletElement);
    };
  }, [mapInstance]);

  return null;
};

export default Routing;
