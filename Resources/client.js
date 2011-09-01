var app = app || {};

-function(exports) {

	function Client(platformId, hostName) {
		if (!(this instanceof Client)) {
			return new Client(platformId, hostName);
		}
		var self = this;
		EventEmitter.call(self);
		
		self.clientId = null;
		self.platformId = platformId;
		self.retry = true;
		self.socket = Ti.Network.createTCPSocket({
			hostName: hostName,
			// hostName: 'ec2-175-41-255-195.ap-northeast-1.compute.amazonaws.com',
			// hostName: 'localhost',
			port: 9337, 
			mode: Titanium.Network.READ_WRITE_MODE
		});
		
		self.on('hello', function(data) {
			self.send('hello', { platformId: self.platformId });
			
			-function() {
				var timer = setInterval(function() {
					self.send('ping');
				}, 5000);
				
				self.on('bye', function(data) {
					clearTimeout(timer);
				});
			}();
		});
		
		self.socket.addEventListener('read', function(event) {
			var data = JSON.parse(event.data);
			Ti.API.log(data);
			
			self.clientId = data.id;
			self.emit(data.type, data.data);
		});
		
		self.socket.addEventListener('writeError', function(event) {
			Ti.API.log(event);
			
			self.socket.close();
			self.emit('close');
		});
		
		self.connect = function() {
			self.socket.connect();
			return self;
		};
		
		self.send = function(type, data) {
			var date;
			if (self.socket.isValid) {
				data = data || {};
				date = new Date();
				_.extend(data, { _timestamp: date.getTime() / 1000 });
				self.socket.write(JSON.stringify({ id: self.clientId , type: type, data: data }));
			}
			return self;
		};
		
		self.disconnect = function() {
			self.send('bye');
			return self;
		};		
	}
	
	Client.prototype = new EventEmitter();
	Client.prototype.constructor = Client;
	
	_.extend(app, {
		Client: Client
	});
	
}({});

_.extend(app, {
	createClient: function(platformId, hostName) {
		return new app.Client(platformId, hostName);
	}
});
