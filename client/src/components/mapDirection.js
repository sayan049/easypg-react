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
    const centerCoordinates = fromLonLat([0, 0]); // Default center
    const mapInstance = new Map({
      target: 'map',
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: centerCoordinates,
        zoom: 2,
      }),
    });

    const vectorLayerInstance = new VectorLayer({
      source: new VectorSource(),
    });
    mapInstance.addLayer(vectorLayerInstance);

    setMap(mapInstance);
    setVectorLayer(vectorLayerInstance);

    return () => {
      mapInstance.setTarget(null);
    };
  }, []);

  const handleGetDirections = () => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      const destination = [coordinates.lng, coordinates.lat];

      // Transform coordinates to map projection
      const userPoint = fromLonLat(userLocation);
      const destinationPoint = fromLonLat(destination);
       console.log("citlali "+userPoint+" "+destination)

      // Add markers
      const userMarker = new Feature({
        geometry: new Point(userPoint),
      });
      const destinationMarker = new Feature({
        geometry: new Point(destinationPoint),
      });

      const markerStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        }),
      });
      userMarker.setStyle(markerStyle);
      destinationMarker.setStyle(markerStyle);

      const routeFeature = new Feature({
        geometry: new LineString([userPoint, destinationPoint]),
      });

      const routeStyle = new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 2,
        }),
      });
      
      routeFeature.setStyle(routeStyle);

      vectorLayer.getSource().clear(); // Clear previous layers
      vectorLayer.getSource().addFeatures([userMarker, destinationMarker, routeFeature]);

      // Center map
      map.getView().fit(routeFeature.getGeometry().getExtent(), { padding: [50, 50, 50, 50] });
    });
  };


  return <>
           <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 m-2.5 " onClick={handleGetDirections}>
            Click Me
           </button>
          <div id="map"  className="h-64 flex items-center justify-center" ></div>;
         </> 
}

export default MapDirection;
// import { Map, View } from 'ol';
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import LineString from 'ol/geom/LineString';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import 'ol/ol.css';
// import { fromLonLat } from 'ol/proj';
// import OSM from 'ol/source/OSM';
// import VectorSource from 'ol/source/Vector';
// import Icon from 'ol/style/Icon';
// import Style from 'ol/style/Style';
// import Stroke from 'ol/style/Stroke';
// import React, { useEffect, useState } from 'react';

// function MapDirection({ coordinates }) {
//   const [userLocation, setUserLocation] = useState(null);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     if (!coordinates || !coordinates.lat || !coordinates.lng) return;

//     // Convert coordinates to OpenLayers projection
//     const centerCoordinates = fromLonLat([coordinates.lng, coordinates.lat]);

//     // Create marker for the provided coordinates
//     const marker = new Feature({
//       geometry: new Point(centerCoordinates),
//     });

//     const markerStyle = new Style({
//       image: new Icon({
//         anchor: [0.5, 1],
//         src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//       }),
//     });
//     marker.setStyle(markerStyle);

//     const vectorSource = new VectorSource({
//       features: [marker],
//     });

//     const vectorLayer = new VectorLayer({
//       source: vectorSource,
//     });

//     const initialMap = new Map({
//       target: 'map',
//       layers: [
//         new TileLayer({ source: new OSM() }),
//         vectorLayer,
//       ],
//       view: new View({
//         center: centerCoordinates,
//         zoom: 15,
//       }),
//     });

//     setMap(initialMap);

//     return () => {
//       initialMap.setTarget(null); // Cleanup map
//     };
//   }, [coordinates]);

//   const handleFetchLocation = () => {
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by your browser.');
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const userCoordinates = fromLonLat([longitude, latitude]);
//         setUserLocation({ lat: latitude, lng: longitude });

//         // Add user marker to the map
//         const userMarker = new Feature({
//           geometry: new Point(userCoordinates),
//         });

//         const userMarkerStyle = new Style({
//           image: new Icon({
//             anchor: [0.5, 1],
//             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//           }),
//         });
//         userMarker.setStyle(userMarkerStyle);

//         const userVectorSource = new VectorSource({
//           features: [userMarker],
//         });

//         const userVectorLayer = new VectorLayer({
//           source: userVectorSource,
//         });

//         map.addLayer(userVectorLayer);

//         // Draw a line between the provided coordinates and the user's location
//         const line = new Feature({
//           geometry: new LineString([userCoordinates, fromLonLat([coordinates.lng, coordinates.lat])]),
//         });

//         const lineStyle = new Style({
//           stroke: new Stroke({
//             color: '#ffcc33',
//             width: 2,
//           }),
//         });
//         line.setStyle(lineStyle);

//         const lineVectorSource = new VectorSource({
//           features: [line],
//         });

//         const lineVectorLayer = new VectorLayer({
//           source: lineVectorSource,
//         });

//         map.addLayer(lineVectorLayer);
//       },
//       (error) => {
//         alert(`Error fetching location: ${error.message}`);
//       }
//     );
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       <div id="map" style={{ height: '400px', width: '100%' }}></div>
//       <button
//         onClick={handleFetchLocation}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           padding: '10px 20px',
//           backgroundColor: '#007BFF',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//         }}
//       >
//         Click Me
//       </button>
//     </div>
//   );
// }

// export default MapDirection;

