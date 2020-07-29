var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// get data
var locations;
var earthquakeMarkers = [];

d3.json(url, function(data){
    locations = data.features;
    // console.log(locations[0].geometry.coordinates);
    console.log(locations[1]);
    // get coordinates and create circles for the map
    // for (var i = 0; i < locations.length; i++) {
    //     earthquakeMarkers.push(
    //         L.circle(locations[i].geometry.coordinates, {
    //             stroke: false,
    //             fillOpacity: 0.8,
    //             color: 'red',
    //             fillColor: 'red',
    //             radius: locations[i].properties.mag
    //         })
    //     );
    //     // console.log(earthquakeMarkers)
    // };

// color intensity of the dots
function getColor(mag) {
  switch (true) {
    case mag > 5:
      return "#ea2c2c";
    case mag > 4:
      return "#ea822c";
    case mag > 3:
      return "#ee9c00";
    case mag > 2:
      return "#eecc00";
    case mag > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  };


// create map base layers 
console.log(locations[1].geometry.coordinates[0], locations[1].geometry.coordinates[1])
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // create map layer group
  var earthquakes = L.layerGroup();
  
  // baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // overlay object
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2.2,
    layers: [streetmap, earthquakes]
  });

  //pass map layers into layer control and add to map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng)
    }, 
    style: function(feature){
      return {
        stroke: false,
        fillOpacity: 1,
        color: 'white',
        fillColor: getColor(feature.properties.mag),
        radius: feature.properties.mag * 2
      }
    },
    onEachFeature: function(feature, layer){
      layer.bindPopup(`Location: ${feature.properties.place} </br> Magnitude: ${feature.properties.mag}`)
    }
  }).addTo(earthquakes);

  
});


