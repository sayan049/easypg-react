import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import React, { useEffect } from 'react';

function MapDirection({ coordinates }) {
  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) return;

    const { lat, lng } = coordinates;
    const centerCoordinates = fromLonLat([lng, lat]); // Convert to EPSG:3857

    // Initialize map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: centerCoordinates, // Correct projection
        zoom: 15, // Adjust zoom level as needed
      }),
    });

    return () => map.setTarget(null); // Cleanup
  }, [coordinates]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
}

export default MapDirection;
