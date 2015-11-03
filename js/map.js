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


/******** realtime location ***********/
$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('http://192.168.111.191:8080');

	var info = $('#infobox');
	var doc = $(document);

	// custom marker's icon styles
	var tinyIcon = L.Icon.extend({
		options: {
			shadowUrl: '../assets/marker-shadow.png',
			iconSize: [25, 39],
			iconAnchor:   [12, 36],
			shadowSize: [41, 41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});
	var redIcon = L.AwesomeMarkers.icon({icon: 'file', markerColor: 'blue'});
	var yellowIcon = L.AwesomeMarkers.icon({icon: 'file', markerColor: 'green'});

	var sentData = {};

	var connects = {};
	var markers = {};
	var active = false;

	socket.on('load:coords', function(data) {
console.dir(data);
		if (!(data.id in connects)) {
console.log('socket.on if');
			setMarker(data);
		}

		connects[data.id] = data;
		connects[data.id].updated = $.now();
	});

	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}

	function positionSuccess(position) {
console.log('positionSuccess');
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;

		// mark user's position
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		// uncomment for static debug
		// userMarker = L.marker([51.45, 30.050], { icon: redIcon });

		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();

//		var emit = $.now();
		// send coords on when user is active
//		doc.on('mousemove', function() {
			active = true;

			sentData = {
				id: userId,
				active: active,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};
console.log('socket.emit()');
//			if ($.now() - emit > 30) {
				socket.emit('send:coords', sentData);
//				emit = $.now();
//			}
//		});
	}

//	doc.bind('mouseup mouseleave', function() {
//		active = false;
//	});

	// showing markers for connections
	function setMarker(data) {
console.log('setMarker data.id: %s', data.id);
		for (var i = 0; i < data.coords.length; i++) {
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>One more external user is here!</p>');
			markers[data.id] = marker;
		}
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
		info.addClass('error').text(msg);

		doc.click(function() {
			info.removeClass('error');
		});
	}

	// delete inactive users every 15 sec
	setInterval(function() {
		for (var ident in connects){
			if ($.now() - connects[ident].updated > 15000) {
				delete connects[ident];
				map.removeLayer(markers[ident]);
			}
		}
	}, 50000);
});
/*** eo realtime ***/
