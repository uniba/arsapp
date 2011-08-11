var client = Ti.App.currentService.client;

-function() {
	var timer = setInterval(function() {
		Ti.Geolocation.getCurrentPosition(function(event) {
			client.send('location', event.coords);
		});
	}, 5000);
}();