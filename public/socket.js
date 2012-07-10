define([], function () {

	var socketIO = io.connect();

	var socket = {

		options: socketIO.socket.options,

		name: function (name) {
			socketIO.emit('name', name);
		},

		whoami: function (fn) {
			socketIO.emit('whoami', fn);
		},

		send: function (message) {
			socketIO.emit('message', message);
		}

	};
	_.extend(socket, Backbone.Events);

	socketIO.on('welcome', function (name) {
		socket.trigger('welcome', name);
	});

	socketIO.on('message', function (data) {
		socket.trigger('message', data);
	});

	socketIO.on('connected', function (data) {
		socket.trigger('connected', data);
	});

	socketIO.on('disconnected', function (data) {
		socket.trigger('disconnected', data);
	});

	return socket;
});