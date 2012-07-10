define([
	'text!views/Chat.html',
	'views/Title',
	'views/Users',
	'views/Messages',
	'model/me',
	'model/users',
	'socket'
], function (chatTemplate, TitleView, UsersView, MessagesView, me, users, socket) {

	return Backbone.View.extend({

		initialize: function () {
			socket.on('welcome', function (user) {
				me.fetch();
				users.fetch();
			}, this);
			socket.on('connected disconnected', function (user) {
				users.fetch();
			}, this);
		},

		render: function () {
			this.renderSubview(new TitleView());
			this.renderSubview(new MessagesView());
			this.$el.append(Mustache.render(chatTemplate, {}));
			this.renderSubview(new UsersView());
			this.$('input').focus();
		},

		onClose: function () {
			socket.off(null, null, this);
		},

		events: {
			'keypress input': 'send'
		},

		send: function (event) {
			if (event.which == 13) {
				var input = this.$('input');
				socket.send(input.val());
				input.val(null);
			}
		}

	});

});