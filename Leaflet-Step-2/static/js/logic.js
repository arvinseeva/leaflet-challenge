var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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



function createFeatures(earthquakeData) {
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
    

    createMap(earthquakes);
}


function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl0dGxlc3Rkb2xsIiwiYSI6ImNqZHdnbTBzYTQ3bXUyeG80ZTQ3dWJtNjIifQ.uvSL6xgyBBXQSJ1Yopx9gA");



    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite": satellitemap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };


    var myMap = L.map("map", {
        center: [34.052235, -119.243683],
        zoom: 4.5,
        layers: [streetmap, earthquakes]
    });

    var legend = L.control({position: 'bottomright'});


    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [color0, color1, color2, color3, color4, color5],
            labels = ["0-1", "1-2","2-3", "3-4", "4-5", "5+"]

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + grades[i] + '"></i> ' + labels[i] + '<br>';
            }
            
            return div;
        };
            
        legend.addTo(myMap);    
    }
    