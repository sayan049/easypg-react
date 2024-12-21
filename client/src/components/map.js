
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

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapComponent({ isChecked }) {
  const mapContainerStyle = {
    height: '84vh',
    width: '35vw',
    display: isChecked ? 'block' : 'none',
  };

  const center = [22.958622435430872, 88.54578601291212];

  return (
    <div id="map" style={mapContainerStyle}>
      <MapContainer
        center={center}
        zoom={15}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center}>
          <Popup>A marker at your location!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;

