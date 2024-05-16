import React, { useState, useRef } from "react";
import {  Marker, Popup, TileLayer } from "react-leaflet";
import Routing from "./RoutingMachine";
import { MapContainer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
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

  const position: [number,number] = [lat, lng];

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[51.505, -0.09]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
  );
};

