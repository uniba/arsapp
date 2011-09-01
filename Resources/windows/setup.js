var app = app || {};

_.extend(app, {
	createSetupWindow: function(options) {
		var win = Ti.UI.createWindow(),
			tvs = Ti.UI.createTableViewSection({
				headerTitle: 'Accounts'
			}),
			tv = Ti.UI.createTableView({
				style: Titanium.UI.iPhone.TableViewStyle.GROUPED
			}),
			nicknameTableViewRow = Ti.UI.createTableViewRow(),
			avatarImageUrlTableViewRow = Ti.UI.createTableViewRow(),
			hostNameTableViewRow = Ti.UI.createTableViewRow(),
			nicknameTextField = Ti.UI.createTextField({
				hintText: 'Nickname',
				keyboardType: Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType: Ti.UI.RETURNKEY_NEXT,
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
				left: 10,
				right: 10,
				value: Ti.App.Properties.getString('nickname')
			}),
			avatarImageUrlTextField = Ti.UI.createTextField({
				hintText: 'Avatar Image URL',
				keyboardType: Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType: Ti.UI.RETURNKEY_NEXT,
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
				left: 10,
				right: 10,
				value: Ti.App.Properties.getString('avatarImageUrl')
			}),
			hostNameTextField = Ti.UI.createTextField({
				hintText: 'Hostname',
				keyboardType: Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType: Ti.UI.RETURNKEY_NEXT,
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
				left: 10,
				right: 10,
				value: Ti.App.Properties.getString('hostName') || app.config.hostName
			}),
			doneButton = Ti.UI.createButton({
				title: 'Done'
			});
			
		avatarImageUrlTextField.addEventListener('change', function(e) {
			iv.image = avatarImageUrlTextField.value;
		});
		
		doneButton.addEventListener('click', function(e) {
			Ti.App.Properties.setString('nickname', nicknameTextField.value);
			Ti.App.Properties.setString('avatarImageUrl', avatarImageUrlTextField.value);
			Ti.App.Properties.setString('hostName', hostNameTextField.value);
			
			win.close();
		});
		
		nicknameTableViewRow.add(nicknameTextField);
		avatarImageUrlTableViewRow.add(avatarImageUrlTextField);
		hostNameTableViewRow.add(hostNameTextField);
		
		tvs.add(nicknameTableViewRow);
		tvs.add(avatarImageUrlTableViewRow);
		tvs.add(hostNameTableViewRow);
		
		tv.setData([tvs]);
		
		win.add(tv);
		win.title = 'Setup';
		win.rightNavButton = doneButton;
		
		return win;
	}
});