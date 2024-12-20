// import React from 'react';
// import {Map,GoogleApiWrapper} from 'google-maps-react';
// // import axios from 'axios';
// // import { findMessUrl } from '../constant/urls';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';

// // Importing the marker icon from Leaflet
// // import markerIcon from 'leaflet/dist/images/marker-icon.png';
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// function MapComponent({isChecked}) {
//     // const mapRef = useRef(null); // useRef hook to store the map instance

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const res = await axios.get(findMessUrl);
//     //             console.log("API response:", res.data);

//     //             const locations = res.data;
//     //             if (Array.isArray(locations) && locations.length > 0) {
//     //                 const firstLocation = locations[0].location;
//     //                 if (firstLocation) {
//     //                     console.log("Location string: ", firstLocation);

//     //                     const [latitude, longitude] = firstLocation.split(',').map(coord => parseFloat(coord));
//     //                     console.log("Parsed latitude: ", latitude);
//     //                     console.log("Parsed longitude: ", longitude);

//     //                     
//     //     };

//     //     fetchData();
//     // }, []); // Empty dependency array ensures it runs only once

//     return (
//         <div id="map" style={{ height: '84vh', width: '35vw' , display: isChecked ? "block" : "none" }} >
//             <Map
//             google={this.props.google}
//             zoom={10}
//             style={{width:'100%', height:'100%'}}
//             initialCentre={{
//                 lat: 22.958622435430872,
//                 lng:88.54578601291212
//             }}
//             />
            
//             </div>
//     );
// }

// //export default MapComponent;

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyAlJ2p7ePie8E9JH4TeouoayKAvathIGr0', 
//   })(MapComponent);
// import React from 'react';
// import { GoogleMap, LoadScript } from '@react-google-maps/api';

// function MapComponent({ isChecked }) {
//   const mapContainerStyle = {
//     height: '84vh',
//     width: '35vw',
//     display: isChecked ? 'block' : 'none',
//   };

//   const center = {
//     lat: 22.958622435430872,
//     lng: 88.54578601291212,
//   };

//   return (
//     <div id="map" style={mapContainerStyle}>
//       <LoadScript googleMapsApiKey="AIzaSyAlJ2p7ePie8E9JH4TeouoayKAvathIGr0">
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
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = ({ isChecked }) => {
  const mapContainerStyle = {
    height: '84vh',
    width: '35vw',
    display: isChecked ? 'block' : 'none',
  };

  const center = {
    lat: 22.958622435430872,
    lng: 88.54578601291212,
  };

  // Use `useJsApiLoader` to load the API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AlzaSyS1FeRMB2-NR6AnmxMU6LPHyxRi5PcY2Pr', // Replace with your valid API key
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div style={mapContainerStyle}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        }}
        center={center}
        zoom={15}
      >
        {/* Add additional markers, layers, or components here */}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;

