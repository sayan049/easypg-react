import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';


function MapDirection({ coordinates }) {
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);

  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.error("No coordinates provided");
      return;
    }

    const centerCoordinates = fromLonLat([coordinates.lng, coordinates.lat]);

    const mapInstance = new Map({
      target: 'map',
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: centerCoordinates,
        zoom: 15,
      }),
    });

    const vectorLayerInstance = new VectorLayer({
      source: new VectorSource(),
    });

    mapInstance.addLayer(vectorLayerInstance);
    setMap(mapInstance);
    setVectorLayer(vectorLayerInstance);

    // Add initial marker for the backend-provided coordinates
    const marker = new Feature({
      geometry: new Point(centerCoordinates),
    });

    const coordinatesMarkerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/placeholder.png',  // Set the icon for coordinates (destination)
        scale: 0.06,  // Adjust the scale if needed
      }),
    });

    marker.setStyle(coordinatesMarkerStyle);
    vectorLayerInstance.getSource().addFeature(marker);

    return () => {
      mapInstance.setTarget(null);
    };
  }, [coordinates]);

  const handleGetDirections = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      const destination = [coordinates.lng, coordinates.lat];

      // Fetch route from OpenRouteService API
      const apiKey =   process.env.REACT_APP_GOOGLE_API_KEY;
      if (!apiKey) {
        console.error('API key is missing. Check your .env file.');
        return;
      }
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userLocation[0]},${userLocation[1]}&end=${destination[0]},${destination[1]}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.features || !data.features.length) {
        alert('No route found!');
        return;
      }

      const routeCoordinates = data.features[0].geometry.coordinates.map((coord) =>
        fromLonLat(coord)
      );

      const routeFeature = new Feature({
        geometry: new LineString(routeCoordinates),
      });

      const routeStyle = new Style({
        stroke: new Stroke({
          color: '#397be6',
          width: 3,
        }),
      });

      routeFeature.setStyle(routeStyle);

      // Clear previous features and add new ones
      vectorLayer.getSource().clear();

      // Add the route to the map
      vectorLayer.getSource().addFeature(routeFeature);

      // Add markers for start and end points
      const userMarker = new Feature({
        geometry: new Point(fromLonLat(userLocation)),
      });

      const destinationMarker = new Feature({
        geometry: new Point(fromLonLat(destination)),
      });

      // User marker with location.png
      const userMarkerStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/location.png',  // Set the icon for the user
          scale: 0.06,  // Adjust the scale if needed
        }),
      });

      // Destination marker with placeholder.png
      const destinationMarkerStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/placeholder.png',  // Set the icon for destination (coordinates)
          scale: 0.06,  // Adjust the scale if needed
        }),
      });

      userMarker.setStyle(userMarkerStyle);
      destinationMarker.setStyle(destinationMarkerStyle);

      vectorLayer.getSource().addFeatures([userMarker, destinationMarker]);

      // Center the map to fit the route
      map.getView().fit(routeFeature.getGeometry().getExtent(), { padding: [50, 50, 50, 50] });
    });
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 m-2.5"
        onClick={handleGetDirections}
      >
        Get Directions
      </button>
      <div id="map" className="h-64 flex items-center justify-center className='hadow-md shadow-gray-300 p-2 border rounded'"></div>
    </>
  );
}

export default MapDirection;
