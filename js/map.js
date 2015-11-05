/*******************
 * map.js
 *
 * npm real.js 
 * to use a realtime localisation
 * of all conected users
 * 
*******************/

var map = L.map('map', {
	zoomControl: false });

map.setView([43.4, 5.5], 11);

L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// start the feedback information module
feed.initModule( 'container', map );


/******** realtime location ***********/
$(function() {
	var userId, socket, redIcon, yellowIcon, sentData,
	    markers = [],
	    sentData = {};

	// generate unique user id
	userId = Math.random().toString(16).substring(2,15);
	socket = io.connect('http://192.168.111.191:8080');

	redIcon = L.AwesomeMarkers.icon({icon: 'file', markerColor: 'blue'});
	yellowIcon = L.AwesomeMarkers.icon({icon: 'file', markerColor: 'green'});

	// check whether browser supports geolocation api
        if (navigator.geolocation) {
                // create the marker and add to the map
                navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
        } else {
                info.text('Your browser is out of fashion, there\'s no geolocation!');
        }

	// receive from server side
	socket.on('load:coords', function(data) {
//console.dir(data);		
		var marker;
		if ( !(data.serverData.id in markers) ) {
			marker  = L.marker([data.serverData.coords[0].lat, data.serverData.coords[0].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>external user (' + data.serverData.id  + ')</p>');
			markers.push(data.serverData.id);
		}
	});

	/// if navigator.geolocation === true
	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;

		// mark user's position
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});

		userMarker.addTo(map);
		userMarker.bindPopup('<p>ID: ' + userId + '</p>').openPopup();

		sentData = {
			id: userId,
			coords: [{
				lat: lat,
				lng: lng,
				acr: acr
			}]
		};
		socket.emit( 'send:coords', {clientData: sentData} );
	}

	// handle geolocation api errors
	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		showError('Error:' + errors[error.code]);
	}

	function showError(msg) {
		//info.addClass('error').text(msg);
		console.log(msg);
	}

});
/*** eo realtime ***/
