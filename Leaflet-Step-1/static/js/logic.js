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

    function getGeoJsonMarkerOptions(feature) {
        color = color5;
        if (feature.properties.mag <= 1) {
            color = color1;
        } else if (feature.properties.mag <= 2) {
            color = color2;
        } else if (feature.properties.mag <= 3) {
            color = color3;
        } else if (feature.properties.mag <= 4) {
            color = color4;
        }

        return {
            radius: feature.properties.mag * 5,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, getGeoJsonMarkerOptions(feature));
        },  
        onEachFeature: handleFeature
    });
    
    var plates = L.geoJSON(plateData, {
    style: function (feature) {
        var latlngs = (feature.geometry.coordinates);
        return L.polyline(latlngs, {color: 'red'});
        }
    });


    createMap(earthquakes, plates);
}


function createMap(earthquakes, plates) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");



    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite": satellitemap
    };

    var overlayMaps = {
        Plates: plates,
        Earthquakes: earthquakes
    };

    