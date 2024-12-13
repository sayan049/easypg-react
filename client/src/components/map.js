import React from 'react';
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

    //                     if (!mapRef.current) {
    //                         // Initialize the map only if it hasn't been initialized already
    //                         mapRef.current = L.map('map').setView([latitude, longitude], 13);
    //                         console.log("Map initialized");

    //                         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //                             maxZoom: 19,
    //                         }).addTo(mapRef.current);
    //                         console.log("Tile layer added to map");

    //                         // Create a custom icon
    //                         const customIcon = L.icon({
    //                             iconUrl: markerIcon,
    //                             shadowUrl: markerShadow,
    //                             iconSize: [25, 41], // size of the icon
    //                             iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    //                             popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    //                             tooltipAnchor: [16, -28], // point from which the tooltip should open relative to the iconAnchor
    //                             shadowSize: [41, 41] // size of the shadow
    //                         });

    //                         console.log("Custom icon created");

    //                         // Add a marker with the custom icon
    //                         L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
    //                         console.log("Marker added to map");
    //                     } else {
    //                         // Update the map view if it already exists
    //                         mapRef.current.setView([latitude, longitude], 13);
    //                     }
    //                 } else {
    //                     console.error("Location data is missing");
    //                 }
    //             } else {
    //                 console.error("No locations found in the response");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []); // Empty dependency array ensures it runs only once

    return (
        <div id="map" style={{ height: '100vh', width: '35vw' , display: isChecked ? "block" : "none" }} >xyz</div>
    );
}

export default MapComponent;
