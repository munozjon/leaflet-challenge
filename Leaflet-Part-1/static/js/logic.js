let basemap = L.tileLayer(
    "",
    {
        attribution: 
        ''
    }
)

let myMap = L.map( "map", {
    center: [,],
    zoom: 6
});

basemap.addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data), {
   
    // Add a GeoJSON layer to the map after loading the file
    let geoJson = L.geoJson(data {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.property.mag}`);
        },
    
    // Turn each feature into a circleMarker on the mao
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
        }

    // Add the legend (look at the activities from day 2 and day 3)
    // Similar to heat map activity from day 3

    }).addTo(myMap);

});