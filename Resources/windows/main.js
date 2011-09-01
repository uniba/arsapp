var app = app || {};

_.extend(app, {
	createMainWindow: function(options) {
		var win = Ti.UI.createWindow(),
			tv = Ti.UI.createTableView({
				style: Titanium.UI.iPhone.TableViewStyle.GROUPED
			});
		
		win.add(tv);
		
		return win;
	}
});