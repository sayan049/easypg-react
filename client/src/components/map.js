
// import React from 'react';
// import { GoogleMap, LoadScript } from '@react-google-maps/api';

// function MapComponent({ isChecked }) {
//   const mapContainerStyle = {
//     height: '84vh',
//     width: '35vw',
//     display: isChecked ? 'block' : 'none',
//   };
// console.log("xxxxxx"+process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
//   const center = {
//     lat: 22.958622435430872,
//     lng: 88.54578601291212,
//   };

//   return (
//     <div id="map" style={mapContainerStyle}>
//       <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//         <GoogleMap
//           mapContainerStyle={{
//             width: '100%',
//             height: '100%',
//             borderRadius: '10px',  // Your custom styles here
//             boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', // Box shadow
//           }}
//           center={center}
//           zoom={15}
//         >
//           {/* You can add markers or other features here */}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// }

// export default MapComponent;
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

function MapComponent({ isChecked,coordinates }) {
  const mapContainerStyle = {
    height: '84vh',
    width: '35vw',
    display: isChecked ? 'block' : 'none',
  };

  useEffect(() => {
    const { lat, lng } = coordinates||['',''];
    const centerCoordinates = fromLonLat([lng, lat]);
    console.log(centerCoordinates);

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
    new Map({
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
  }, []);

  return <div id="map" style={mapContainerStyle}></div>;
}

export default MapComponent;
