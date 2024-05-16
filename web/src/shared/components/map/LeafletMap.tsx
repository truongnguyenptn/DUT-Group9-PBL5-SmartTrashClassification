import React, { useState, useRef } from "react";
import {  TileLayer } from "react-leaflet";
import Routing from "./RoutingMachine";
import { MapContainer } from 'react-leaflet'
export const LeafletMap = () => {
  const [lat, setLat] = useState(57.74);
  const [lng, setLng] = useState(11.94);
  const [zoom, setZoom] = useState(13);
  const [isMapInit, setIsMapInit] = useState(false);
  const mapRef = useRef(null);

  const saveMap = (map) => {
    mapRef.current = map;
    setIsMapInit(true);
  };

  const position = [lat, lng];

  return (
    <MapContainer ref={saveMap}>
      <TileLayer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {isMapInit && <Routing map={mapRef.current} />}
    </MapContainer>
  );
};

