var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('join', function(data) {
    socket.join(data.channel);
  });
});
