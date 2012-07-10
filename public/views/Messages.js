define([
	'socket',
	'model/Message',
	'model/messages',
	'text!views/Message.html'
], function (socket, Message, messages, messageTemplate) {

	return Backbone.View.extend({

		tagName: 'ul',
		className: 'messages',

		initialize: function () {

			socket.on('message', function (data) {
				messages.add(new Message(data));
			}, this);

			socket.on('welcome', function (user) {
				messages.add(new Message({
					text: 'welcome, ' + user + '!'
				}));
			}, this);

			socket.on('connected', function (data) {
				messages.add(new Message({
					time: data.time,
					text: data.user + ' connected.'
				}));
			}, this);

			socket.on('disconnected', function (data) {
				messages.add(new Message({
					time: data.time,
					text: data.user + ' disconnected.'
				}));
			}, this);

			messages.on('add', function () {
				this.render();
				this.newMessage();
			}, this);

			var self = this;
			this.interval = setInterval(function () {
				self.render();
			}, 1000);

		},

		render: function () {
			this.$el.empty();
			var self = this;
			messages.each(function (message) {
				var msg = message.toJSON();
				if (msg.time) {
					msg.time = moment(msg.time).from(new Date());
				}
				self.$el.append(Mustache.render(messageTemplate, msg));
			});
		},

		newMessage: function () {
			this.el.scrollTop = this.el.scrollHeight;
		},

		onClose: function () {
			socket.off(null, null, this);
			message.off(null, null, this);
			clearInterval(this.interval);
		}

	});

});