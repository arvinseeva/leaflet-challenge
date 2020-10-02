var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

var color0 = "limegreen";
var color1 = "chartreuse";
var color2 = "yellow";
var color3 = "orange";
var color4 = "darkorange";
var color5 = "red";
var legend = L.control();

d3.json(quakes, function(data) {
    loadPlates(data.features);
});

function loadPlates(earthquakeData) {
    d3.json(plates, function(data) {
        createFeatures(earthquakeData, data.features);
    });    
}

function createFeatures(earthquakeData, plateData) {
    function handleFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    