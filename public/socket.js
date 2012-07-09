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

	socketIO.on('message', function (message) {
		socket.trigger('message', message);
	});

	socketIO.on('connected', function (name) {
		socket.trigger('connected', name);
	});

	socketIO.on('disconnected', function (name) {
		socket.trigger('disconnected', name);
	});

	return socket;
});