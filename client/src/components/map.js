
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

function MapComponent({ isChecked }) {
  const mapContainerStyle = {
    height: '84vh',
    width: '35vw',
    display: isChecked ? 'block' : 'none',
  };

  useEffect(() => {
    new Map({
      target: 'map',
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: [9866767, 2618506], zoom: 15, projection: 'EPSG:3857' }),
    });
  }, []);

  return <div id="map" style={mapContainerStyle}></div>;
}

export default MapComponent;
