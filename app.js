var _ = require("underscore")
  , express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {

  socket.on('name', function (name) {
    socket.set('name', name, function () {
      socket.emit('welcome', name);
      socket.broadcast.emit('connected', {
        time: new Date().getTime(),
        user: name
      });
    });
  });

  socket.on('whoami', function (fn) {
    socket.get('name', function (err, name) {
      fn(name);
    });
  });

  socket.on('message', function (message) {
    socket.get('name', function (err, name) {
      io.sockets.emit('message', {
        time: new Date().getTime(),
        from: name,
        text: message
      });
    });
  });

  socket.on('disconnect', function () {
    socket.get('name', function (err, name) {
      io.sockets.emit('disconnected', {
        time: new Date().getTime(),
        user: name
      });
    });
  });

});

app.configure(function () {
//  app.use(express.logger());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.get('/users', function (req, res) {
  var names = [];
  _.each(io.sockets.clients(), function (socket) {
    socket.get('name', function (err, name) {
      if (name) {
        names.push({ user: name });
      }
    });
  });
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache, no-store');
  res.send(names);
});
app.get(/^\/[^\/]*$/, function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(1111);