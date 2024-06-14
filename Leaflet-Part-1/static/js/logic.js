// Set base tileLayer
var baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map
let myMap = L.map( "map", {
    center: [40,-105],
    zoom: 4
});

baseMap.addTo(myMap);

// Get the color based on earthquake depth -> feature.geometry.coordinates[2]
function getColor (depth) {
    if (depth > 10) {
        return "blue"
    }
    else {
        return "green"
    }
};

// Get the radius based on magnitude -> feature.properties.mag
function getRadius (magnitude) {

    if (magnitude == 0) {
        magnitude += 1
    }

    return magnitude * 5
};

// Set the url to the geoJson file
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Make a call to the geoJson url
d3.json(url).then(function (data) {
   
    // Add a GeoJSON layer to the map after loading the file
    let geoJson = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3> <hr> <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`);
        },
    
        // Turn each feature into a circleMarker on the map
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000000",
                opacity: 1,
                fillOpacity: 1,
                stroke: true,
                weight: 0.5
            });
        }

    // Add the legend (look at the activities from day 2 and day 3)
    // Similar to heat map activity from day 3

    }).addTo(myMap);

});