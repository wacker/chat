define([
	'model/User',
	'socket'
], function (User, socket) {

	return new (User.extend({

		fetch: function () {
			var self = this;
			socket.whoami(function (name) {
				self.set('name', name);
			});
		}

	}))();

});