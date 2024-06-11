let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

let myMap = L.map( "map", {
    center: [45,-75],
    zoom: 6
});

basemap.addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
   
    // Add a GeoJSON layer to the map after loading the file
    let geoJson = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.properties.mag}`);
        },
    
    // Turn each feature into a circleMarker on the map
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
        }

    // Add the legend (look at the activities from day 2 and day 3)
    // Similar to heat map activity from day 3

    }).addTo(myMap);

});