/*******************
 * map.js
 *
 * npm real.js 
 * to use a realtime localisation
 * of all conected users
 * 
*******************/

var 
	geoloc = false,
	map = L.map('map', {
		zoomControl: false });

map.setView([43.4, 5.5], 11);

L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// start the feedback information module
feed.initModule( 'container', map );

/********* Modernizr activity **********/
// detect if exists
if ( Modernizr ) {
	if ( Modernizr.geolocation ) {
		geoloc = true;
	}
}
else {
	console.log('Modernizr NO exists');
}
/****** eo Modernizr *******/

/******** realtime location ***********/
$(function() {
	var socket, redIcon, yellowIcon, userMarker, userId,
	    markers 	= {};

	socket  = io.connect('http://192.168.111.191:8080');

	redIcon 	= L.AwesomeMarkers.icon({icon: 'file', markerColor: 'blue'});
	yellowIcon 	= L.AwesomeMarkers.icon({icon: 'file', markerColor: 'green'});

	// check whether browser supports geolocation api
        if ( geoloc ) {
                // create the marker and add to the map
		console.log('geoloc');		
//                navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 });
        } else {
                info.text('Your browser is out of fashion, there\'s no geolocation!');
        }

	map.locate({
        	watch                   : true, // map.stopLocate() to stop
	        setView                 : false,
        	timeout                 : 10000, // to wait before firing locationerror
	        maximumAge              : 10, // Maximum age of detection location
        	enableHighAccurracy     : true
	})
	.on( 'locationfound', positionSuccess ) /*function(e){
	    console.dir(e);
            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
            var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2
            });
            map.addLayer(marker);
            map.addLayer(circle);
        }) */
       .on('locationerror', function(e){
            console.log(e);
            console.log("Location access denied.");
        });

	// receive from server side
	socket.on('load:coords', function(data) {
//console.dir(data);		
		var marker;
		if ( !(data.serverData.id in markers) ) {
			marker  = L.marker([data.serverData.coords[0].lat, data.serverData.coords[0].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>external user (' + data.serverData.id  + ')</p>');
			markers[data.serverData.id] = marker;
		}
		else {
			markers[data.serverData.id].setLatLng( [data.serverData.coords[0].lat, data.serverData.coords[0].lng] );
		}
	});

	/// if navigator.geolocation === true
	function positionSuccess(position) {
		var sentData	= {};

		if ( userMarker ) {
			userMarker.setLatLng( [position.latitude, position.longitude] );
		}
		else {
        		userId  = Math.random().toString(16).substring(2,15); // generate unique user id
console.dir(position);
			// mark user's position
			userMarker = L.marker([position.latitude, position.longitude], {
				icon: redIcon
			});

			userMarker.addTo(map);
			userMarker.bindPopup('<p>ID: ' + userId + '</p>').openPopup();
		}

		sentData = {
			id	: userId,
			ts      : position.timestamp,
			coords: [{
				lat	: position.latitude,
				lng	: position.longitude,
				north	: position.heading,
				acr	: position.accuracy
			}]
		};
		socket.emit( 'send:coords', {clientData: sentData} );
	}

	// handle geolocation api errors
	// add close socket when location failed
	function positionError(error) {
console.dir(error);
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
