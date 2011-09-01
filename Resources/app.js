var app = {};

Ti.include('lib/underscore.js');
Ti.include('lib/event_emitter.js');
Ti.include('config.js');
Ti.include('client.js');
Ti.include('windows/setup.js');
Ti.include('windows/main.js');

Ti.Geolocation.preferredProvider = "gps";
Ti.Geolocation.purpose = "GPS demo";

-function() {
	var a = Ti.UI.createAlertDialog({}),
		setupWin = app.createSetupWindow(),
		mainWin = app.createMainWindow();
		
	a.message = 'Connection closed. Re-try?';
	a.buttonNames = ['OK','Cancel'];
	a.cancel = 1;
	
	mainWin.open();
	
	setupWin.open({
		modal: true
	});
	
	setupWin.addEventListener('close', function(e) {
		var hostName = Ti.App.Properties.getString('hostName'),
			client = app.createClient(Ti.Platform.id, hostName),
			backgroundService = Ti.App.iOS.registerBackgroundService({
				url: 'background.js',
				client: client
			});
		
		client.on('hello', function(data) {
			Ti.API.log(data);
			
			Ti.Geolocation.addEventListener('location', function(event) {
				client.send('location', event.coords);
			});
			
			Ti.Geolocation.addEventListener('heading', function(event) {
				client.send('heading', event.heading);
			});
			
			Ti.App.addEventListener('pause', function(event) {
				client.send('pause');
			});
			
			Ti.App.addEventListener('resume', function(event) {
				client.send('resume');
				backgroundService.unregister();
			});
			
			Ti.Accelerometer.addEventListener('update', function(event) {
				client.send('accelerometer', {
					x: event.x,
					y: event.y,
					z: event.z
				});
			});
		});
		
		client.on('close', function() {
			Ti.Media.vibrate();
			
			a.addEventListener('click', function(e) {
				if (a.index === 0) {
					client.connect();
				}
			});
			a.show();
		});
		
		client.connect();
	});
}();

Ti.API.log(app);
