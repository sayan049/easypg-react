
import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';


function MapComponent({ isChecked, coordinates }) {
  const mapContainerStyle = {
    height: '84vh',
    width: '35vw',
    display: isChecked ? 'block' : 'none',
    boxshadow:' rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    padding:'10px'
  };

  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) return;

    // Ensure coordinates are numbers
    const { lat, lng } = coordinates;
    const centerCoordinates = fromLonLat([lng, lat]);
    console.log("fuck"+coordinates+" "+lng+" "+lat+" "+centerCoordinates);

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

  return <div id="map" style={mapContainerStyle}></div>;
}

export default MapComponent;
