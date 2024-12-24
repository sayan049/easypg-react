// import React, { useEffect, useState } from 'react';
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

// function MapDirection({ coordinates }) {
//   const [map, setMap] = useState(null);
//   const [vectorLayer, setVectorLayer] = useState(null);

//   useEffect(() => {
//     const centerCoordinates = fromLonLat([0, 0]); // Default center
//     const mapInstance = new Map({
//       target: 'map',
//       layers: [new TileLayer({ source: new OSM() })],
//       view: new View({
//         center: centerCoordinates,
//         zoom: 2,
//       }),
//     });

//     const vectorLayerInstance = new VectorLayer({
//       source: new VectorSource(),
//     });
//     mapInstance.addLayer(vectorLayerInstance);

//     setMap(mapInstance);
//     setVectorLayer(vectorLayerInstance);

//     return () => {
//       mapInstance.setTarget(null);
//     };
//   }, []);

//   const handleGetDirections = () => {
//     if (!coordinates || !coordinates.lat || !coordinates.lng) return;

//     navigator.geolocation.getCurrentPosition((position) => {
//       const userLocation = [position.coords.longitude, position.coords.latitude];
//       const destination = [coordinates.lng, coordinates.lat];

//       // Transform coordinates to map projection
//       const userPoint = fromLonLat(userLocation);
//       const destinationPoint = fromLonLat(destination);
//        console.log("citlali "+userPoint+" "+destination)

//       // Add markers
//       const userMarker = new Feature({
//         geometry: new Point(userPoint),
//       });
//       const destinationMarker = new Feature({
//         geometry: new Point(destinationPoint),
//       });

//       const markerStyle = new Style({
//         image: new Icon({
//           anchor: [0.5, 1],
//           src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//         }),
//       });
//       userMarker.setStyle(markerStyle);
//       destinationMarker.setStyle(markerStyle);

//       const routeFeature = new Feature({
//         geometry: new LineString([userPoint, destinationPoint]),
//       });

//       const routeStyle = new Style({
//         stroke: new Stroke({
//           color: '#ff0000',
//           width: 2,
//         }),
//       });
      
//       routeFeature.setStyle(routeStyle);

//       vectorLayer.getSource().clear(); // Clear previous layers
//       vectorLayer.getSource().addFeatures([userMarker, destinationMarker, routeFeature]);

//       // Center map
//       map.getView().fit(routeFeature.getGeometry().getExtent(), { padding: [50, 50, 50, 50] });
//     });
//   };


//   return <>
//            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 m-2.5 " onClick={handleGetDirections}>
//             Click Me
//            </button>
//           <div id="map"  className="h-64 flex items-center justify-center" ></div>;
//          </> 
// }

// export default MapDirection;
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

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    marker.setStyle(markerStyle);
    vectorLayerInstance.getSource().addFeature(marker);

    return () => {
      mapInstance.setTarget(null);
    };
  }, [coordinates]);

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      const destination = [coordinates.lng, coordinates.lat];

      const userPoint = fromLonLat(userLocation);
      const destinationPoint = fromLonLat(destination);

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

      vectorLayer.getSource().clear();
      vectorLayer.getSource().addFeatures([userMarker, destinationMarker, routeFeature]);

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
      <div id="map" className="h-64 flex items-center justify-center"></div>
    </>
  );
}

export default MapDirection;
