import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export * from './LeafletMap';
export const InteractiveMap = () => {
  const mapRef = useRef(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [routeLayer, setRouteLayer] = useState(null);
  const [totalTime, setTotalTime] = useState(null);

  useEffect(() => {
    mapRef.current = L.map('map').setView([16.0544, 108.2022], 14); // Da Nang city coordinates: [16.0544, 108.2022]

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    return () => {
      mapRef?.current.remove();
    };
  }, []);

  const handleMapClick = (e) => {
    if (startPoint) {
      setEndPoint(e.latlng);
    } else {
      setStartPoint(e.latlng);
    }
  };

  const handleAddWaypoint = () => {
    if (waypoints.length >= 15) {
      alert('Maximum number of waypoints reached');
      return;
    }
    setWaypoints((prevWaypoints) => [...prevWaypoints, endPoint]);
  };

  const handleFindRoute = () => {
    // Check if start and end points are defined
    if (!startPoint || !endPoint) {
      alert('Please select both a start point and an end point.');
      return;
    }

    const geojson = [
      [startPoint.lat, startPoint.lng],
      ...waypoints.map((waypoint) => [waypoint.lat, waypoint.lng]),
      [endPoint.lat, endPoint.lng]
    ];

    fetch('/find_route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ geojson })
    })
      .then((response) => response.json())
      .then((data) => {
        if (routeLayer) {
          mapRef.current?.removeLayer(routeLayer);
        }
        const routeLayer = L.geoJSON(data).addTo(mapRef.current);
        setRouteLayer(routeLayer);

        // Calculate total time
        const duration = data.features[0].properties.summary.duration;
        const totalTime = Math.floor(duration);
        setTotalTime(totalTime);
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <div id="map" style={{ float: 'right', width: '70%', height: '100vh' }} onClick={handleMapClick}></div>
      <div id="controls" style={{ float: 'left', width: '30%', padding: '10px', boxSizing: 'border-box' }}>
        <div className="control">
          <button onClick={() => setStartPoint(null)}>Choose a start point</button>
          <div id="startPoint" className={startPoint ? 'blue' : ''}>Start Point: <br />Latitude: {startPoint ? startPoint.lat.toFixed(4) : ''}<br />Longitude: {startPoint ? startPoint.lng.toFixed(4) : ''}</div>
        </div>
        <div className="control">
          <button onClick={() => setEndPoint(null)}>Choose an end point</button>
          <div id="endPoint" className={endPoint ? 'red' : ''}>End Point: <br />Latitude: {endPoint ? endPoint.lat.toFixed(4) : ''}<br />Longitude: {endPoint ? endPoint.lng.toFixed(4) : ''}</div>
        </div>
        <div className="control">
          <button onClick={handleAddWaypoint}>Add a waypoint</button>
          <div id="wayPoints" className="green">
            {waypoints.map((waypoint, index) => (
              <div key={index} className="waypoint-list">
                Waypoint {index + 1}:<br />
                Latitude: {waypoint?.lat?.toFixed(4)}<br />
                Longitude: {waypoint?.lng?.toFixed(4)}<br />
                <button onClick={() => setWaypoints((prevWaypoints) => prevWaypoints.filter((_, i) => i !== index))}>Delete</button>
              </div>
            ))}
          </div>
        </div>
        <div className="control">
          <button onClick={handleFindRoute}>Find route</button>
          <div id="totalTime">Total Time: {totalTime ? formatTime(totalTime) : ''}</div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (totalTime) => {
  const h = Math.floor(totalTime / 3600);
  const m = Math.floor((totalTime - h * 3600) / 60);
  const s = totalTime % 60;
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
};
