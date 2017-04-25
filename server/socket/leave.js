var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('leave', function(data) {
    socket.leave(data.channel);
  });
});
