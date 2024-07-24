// Create arrays for the colors and depth ranges to be used in the markers and legend
const colorsArr = ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"];
const depthRanges = ["90+", "70-90", "50-70", "30-50", "10-30", "-10-10"];



function createMap(earthquakeData) {

    // Create the background layers for our map
    var standard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Initialize the marker layer groups
    let earthquakes = createMarkers(earthquakeData)
    let plates = L.layerGroup()

    // Load the tectonic plates GeoJSON data and add to the layer group
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData){
        L.geoJson(plateData, {
            color:"yellow"
        }).addTo(plates)
    
    })


    // Create a baseMaps object to hold the background layers
    let baseMaps = {
        "Standard": standard,
        "Topography": topo,
        "Satellite": satellite
      };
  
    // Create an overlayMaps object to hold the earthquakes and tectonic plates layer groups
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": plates
      };

    // Create the map object with options
    let myMap = L.map("map", {
      center: [40.73, -100.0059],
      zoom: 3,
      layers: [standard, earthquakes, plates]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
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
  };


function createMarkers(data) {

    // Get the color based on earthquake depth -> feature.geometry.coordinates[2]
    function getColor(depth) {
        return depth > 90  ? colorsArr[0] :
                depth > 70  ? colorsArr[1] :
                depth > 50  ? colorsArr[2] :
                depth > 30   ? colorsArr[3] :
                depth > 10   ? colorsArr[4] :
                        colorsArr[5];
    }
    // Get the radius based on magnitude -> feature.properties.mag
    function getRadius (magnitude) {
        if (magnitude == 0) {
            magnitude += 1
        }
        return magnitude * 5
    };
    
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
    });
    return geoJson;
};


// Make a call to the GeoJSON URL
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
       createMap(data);
});