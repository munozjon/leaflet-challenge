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
let colorsArr = ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"]
let depthRanges = ["90+", "70-90", "50-70", "30-50", "10-30", "-10-10"]

function getColor (depth) {
    if (depth > 90) {
        return colorsArr[0]
    }
    else if (depth > 70) {
        return colorsArr[1]
    }
    else if (depth > 50) {
        return colorsArr[2]
    }
    else if (depth > 30) {
        return colorsArr[3]
    }
    else if (depth > 10) {
        return colorsArr[4]
    }
    else {
        return colorsArr[5]
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
            layer.bindPopup(`<h3>${feature.properties.place}</h3> <hr> <h4>Magnitude: ${feature.properties.mag}</h4> <h4>Depth: ${feature.geometry.coordinates[2]}</h4>`);
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


    }).addTo(myMap);

    // Create the legend
    let legend = L.control({position: "bottomright"});

    // Function to add labels to the legend
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        // Loop through ranges and return an HTML item
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorsArr[i] + '"></i> ' +
                depthRanges[i] + '<br>';
        }

        return div;
    };

    legend.addTo(myMap);


});