# leaflet-challenge

## Module 15 Challenge

For this challenge, I created a visualization of earthquake data from the USGS GeoJSON Feed (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). In particular, I chose the data for all earthquakes from the past 7 days. Using Leaflet and d3 in JavaScript, I created a map with a GeoJSON layer containing circle markers for each earthquake from the dataset. I further modified the markers to change in size according to the magnitude of the earthquake. I also had the markers change in color according to the depth, based on an interval scale from -10 to over 90.

Furthermore, I created a legend to identify the color scale more easily to the user. The legend was created by adding a div HTML element and appending items for each scale, along with a square for the color it is identifying. The final HTML script was modified using CSS styling, particularly on the legend.