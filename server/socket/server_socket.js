var server_socket = require('socket.io')();
var socket_io_redis = require('socket.io-redis');

if (process.env.NODE_ENV == 'production') {
  server_socket.adapter(socket_io_redis({
    host: 'overmatch.9lsyy2.0001.apn2.cache.amazonaws.com',
    port: 6379
  }));
}

module.exports = server_socket;
