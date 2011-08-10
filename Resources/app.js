Ti.include('lib/underscore.js');

-function() {
	var app = {},
		clientId,
		view = Ti.UI.createView(),
		win = Ti.UI.createWindow(),
		label = Ti.UI.createLabel({
			text: 'label',
			backgroundColor: '#fff'
		}),
		socket = Ti.Network.createTCPSocket({
			hostName: 'ec2-175-41-255-195.ap-northeast-1.compute.amazonaws.com',
			port: 9337, 
			mode: Titanium.Network.READ_WRITE_MODE
		}),
		backgroundService = Ti.App.iOS.registerBackgroundService({
			url: 'background.js'
		});
		
	socket.addEventListener('read', function(event) {
		Ti.API.debug(event);
		var response = JSON.parse(event.data);
		clientId = response.id;
		if (response.command === 'hello') {
			socket.write(JSON.stringify({ id: clientId, command: 'hello', data: { platformId: Ti.Platform.id } }));
		}
	});
	
	win.add(label);
	win.open();
	
	// socket.addEventListener('readError writeError', function(event) {
		// Ti.API.warn(event);
		// Ti.API.warn("length : " + buf.length + " buffer : " + buf);
	// });

	try {
		socket.connect();
	} catch (e) {
		Ti.API.warn("connect error");
	}
	
	Ti.Geolocation.getCurrentPosition(function(event) {
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'location', data: event, timestamp: new Date() / 1000 }));
		}
	});
	
	Ti.Geolocation.getCurrentHeading(function(event) {
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'heading', data: event, timestamp: new Date() / 1000 }));
		}
	});
	
	Ti.Accelerometer.addEventListener('update', function(event) {
		label.text = event.x + ' ' + event.y + ' ' + event.z;
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'accel', data: event }));
		}
	});
	
	Ti.Geolocation.addEventListener('location', function(event) {
		if (e.error) {
			Ti.API.warn(e.error);
			// return;
		}
		console.log(event);
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'location', data: event }));
		}
	});
	
	Ti.Geolocation.addEventListener('heading', function(event) {
		if (e.error) {
			Ti.API.warn(e.error);
			// return;
		}
		console.log(event);
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'heading', data: event }));
		}
	});
	
	setInterval(function() {
		var date;
		if (socket.isValid) {
			date = new Date();
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'ping', data: null, timestamp: new Date() / 1000 }));
		}
	}, 1000);
	
	Ti.App.addEventListener('pause', function(event) {
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'pause', data: null }));
		}
	});
	
	Ti.App.addEventListener('resume', function(event) {
		if (socket.isValid) {
			socket.write(JSON.stringify({ id: Ti.Platform.id, command: 'resume', data: null }));
		}
		backgroundService.unregister();
	});
}();
