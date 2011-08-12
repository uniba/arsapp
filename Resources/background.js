var client = Ti.App.currentService.client;

-function() {	
	Ti.Geolocation.addEventListener('location', function(event) {
		client.send('location', event.coords);
	});
}();

Ti.API.log(client);
