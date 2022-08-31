import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import dot from "./rec.png";
import dotBlack from "./button.png";
import flag from "./red-flag.png"
//import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Marker = ({ onClick, children, feature }) => {
  const _onClick = (e) => {
    onClick("Status : " + feature.canLevel);
  };

  return (
    <button onClick={_onClick} className="marker">
      {children}
    </button>
  );
};

const Map = (props) => {
  const [jsonArray, setJsonArray] = useState(props.json);
  const mapContainerRef = React.createRef();

  const [lat, setLng] = useState(-15.894459);
  const [lng, setLat] = useState(35.228676);
  const [zoom, setZoom] = useState(15);

  var path = {
    "type": "FeatureCollection",
    "name": "Flight_path",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "0", "Field_1": "0" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 35.225848810631, -15.89159223573159 ], [ 35.228147211468972, -15.88978879760624 ] ] ] } },
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "1", "Field_1": "0" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 35.228147211468972, -15.88978879760624 ], [ 35.230373057956783, -15.89382008350707 ] ] ] } },
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "2", "Field_1": "0" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 35.230373057956783, -15.89382008350707 ], [ 35.231447263865377, -15.89440778305101 ],
            [ 35.233948814088798, -15.895471963083089 ], [ 35.234106593964597, -15.894997029538519 ], [ 35.2313521854839, -15.89384940698365 ], [ 35.230088844242182, -15.89307241545519 ], [ 35.226773915249652, -15.892048838229771 ], [ 35.225848810631, -15.89159223573159 ] ] ] } }
    ]
  }

  // Initialize map when component mounts
  useEffect(() => {
    setJsonArray(props.json);
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom,
    });

    // Render custom marker components
    jsonArray?.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div");
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} feature={feature.trashcans} />,
        ref.current
      );

      /*
      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat([feature.longitude, feature.latitude])
        .addTo(map);

       */
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on("load", function() {
      map.addSource("flightPoints", {
        "type": "geojson",
        "data": path
      });

      map.addLayer({
        'id': 'flightPoints',
        'type': 'line',
        'source': 'flightPoints',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 5
        }
      });
      map.loadImage(
          dot,
          function(error, image) {
            map.addImage("custom-marker", image);

            map.addSource('points', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [
                  {
// feature for Mapbox DC
                    'type': 'Feature',
                    'geometry': {
                      'type': 'Point',
                      'coordinates': [ 35.225848810631, -15.89159223573159 ]
                    },
                    'properties': {
                      'title': 'Start'
                    }
                  },
                  {
// feature for Mapbox SF
                    'type': 'Feature',
                    'geometry': {
                      'type': 'Point',
                      'coordinates':  [ 35.228147211468972, -15.88978879760624 ]
                    },
                    'properties': {
                      'title': 'End'
                    }
                  }
                ]
              }
            });

// Add a symbol layer
            map.addLayer({
              'id': 'points',
              'type': 'symbol',
              'source': 'points',
              'layout': {
                'icon-image': 'custom-marker',
// get the title name from the source's "title" property
                'text-field': ['get', 'title'],
                'text-font': [
                  'Open Sans Semibold',
                  'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
              }
            });




          })

      map.loadImage(
          flag,
          function(error, image) {
            map.addImage("marker-flag", image);
            console.log(jsonArray)
            map.addSource('flags', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': jsonArray
              }
            });

            map.addLayer({
              'id': 'flagged',
              'type': 'symbol',
              'source': 'flags',
              'layout': {
                'icon-image': "marker-flag",
              }
            });
          })

    });


    // Clean up on unmount
    return () => map.remove();
  }, [props.json, jsonArray]); // eslint-disable-line react-hooks/exhaustive-deps

  const markerClicked = (title) => {
    window.alert(title);
  };

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
