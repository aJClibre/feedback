var map = L.map('map', {
	zoomControl: false });

map.setView([43.4, 5.5], 11);

L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//var marker = L.marker([43.47312, 5.43947]).addTo(map);

// start the feedback information module
feed.initModule( 'container', map );
