import { Map, View } from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import React, { useEffect } from 'react';

function MapDirection({ isChecked, coordinates }) {
  const mapContainerStyle = {
    // height: '84vh',
    // width: '35vw',
    // display: isChecked ? 'block' : 'none',
  };

  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) return;

    // Ensure coordinates are numbers
    const { lat, lng } = coordinates;
    const centerCoordinates = fromLonLat([lng, lat]);

    // Create a marker feature
    const marker = new Feature({
      geometry: new Point(centerCoordinates),
    });

    // Style for the marker
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Replace with your custom icon if needed
      }),
    });
    marker.setStyle(markerStyle);

    // Vector layer for the marker
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });

    // Initialize map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer, // Add the marker layer
      ],
      view: new View({
        center: centerCoordinates,
        zoom: 15,
      }),
    });

    // Cleanup function to destroy the map when the component unmounts
    return () => {
      map.setTarget(null); // This will destroy the map
    };
  }, [coordinates]); // Re-run effect when coordinates change

  return <div id="map" style={mapContainerStyle} className="h-64 flex items-center justify-center" ></div>;
}

export default MapDirection;
