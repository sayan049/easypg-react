import React from 'react';
import {Mao,GoogleApiWrapper} from 'google-maps-react';
// import axios from 'axios';
// import { findMessUrl } from '../constant/urls';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// Importing the marker icon from Leaflet
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function MapComponent({isChecked}) {
    // const mapRef = useRef(null); // useRef hook to store the map instance

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get(findMessUrl);
    //             console.log("API response:", res.data);

    //             const locations = res.data;
    //             if (Array.isArray(locations) && locations.length > 0) {
    //                 const firstLocation = locations[0].location;
    //                 if (firstLocation) {
    //                     console.log("Location string: ", firstLocation);

    //                     const [latitude, longitude] = firstLocation.split(',').map(coord => parseFloat(coord));
    //                     console.log("Parsed latitude: ", latitude);
    //                     console.log("Parsed longitude: ", longitude);

    //                     
    //     };

    //     fetchData();
    // }, []); // Empty dependency array ensures it runs only once

    return (
        <div id="map" style={{ height: '84vh', width: '35vw' , display: isChecked ? "block" : "none" }} >
            <Map
            google={this.props.google}
            zoom={10}
            style={{width:'100%', height:'100%'}}
            initialCentre={{
                lat: 22.958622435430872,
                lng:88.54578601291212
            }}
            />
            
            </div>
    );
}

//export default MapComponent;

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAlJ2p7ePie8E9JH4TeouoayKAvathIGr0', 
  })(MapComponent);
