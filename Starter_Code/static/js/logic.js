
// Store the geoJSON data from URL endpoint
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// create a function for the circle size 
function markerSize(size) {
    return (size) * 5;
}
// create a function to determine the color of the circle based on the depth of the earthquake. 
function colorScale(depth){
    var colorRange= d3.scaleSequential().domain([0,10]).interpolator(d3.interpolateViridis);;
    var colors=colorRange(depth);
    return colors;
}
// create the map function
function createMap(earthquakes){
    // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// Create a baseMaps object to hold the streetmap layer.
var baseMaps = {
  "Street Map": streetmap
};
// Create an overlayMaps object to hold the bikeStations layer.
var overlayMaps = {
  "Earthquakes": earthquakes
};
// Create the map object with options.
var map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
 L.control.layers(baseMaps, overlayMaps, {
 collapsed: false
 }).addTo(map);
}

// create a function to store the features of each earthquake in the features array 
function earthquakeFeatures(data){

    //create an empty list for earthquake location data, size data, depth data
    var size= [];

    // For each earthquake in the data set, create a circle layer with its location and bind a popup with the magnitude and date
    for (var i=0; i< data.length; i++){
        // Setting the circle radius for the earthquake by passing magnitude into the markerSize function
        // color scale and marker size are reffered to the respective functions to calculate value. 
          var locations= L.circleMarker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],{
                stroke: false,
                fillOpacity: 0.75,
                color: colorScale(data[i].geometry.coordinates[2]),
                fillColor: colorScale(data[i].geometry.coordinates[2]),
                radius: markerSize(data[i].properties.mag)
                
    }).bindPopup(`<h3> Magnitude: ${data[i].properties.mag}</h3><hr> <h3> Depth: ${data[i].geometry.coordinates[2]} meters <hr> <p>${new Date(data[i].properties.time)}</p>`);
    size.push(locations)
    }

// Create a layer group that's made from the size array, and pass it to the createMap function.
var location= L.layerGroup(size);
createMap(location);
}

// Perform a d3 get request on the url and store the response in 'data'
d3.json(url).then(function(data) {
    // call the earthquakeFeatures function with the data
    earthquakeFeatures(data.features);
});

   