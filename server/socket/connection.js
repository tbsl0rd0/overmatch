var mongodb = require('../mongodb/mongodb');
var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  if (!socket.handshake.session.user) {
    return;
  }

  mongodb.get_db(function(db) {
    db.collection('users').insertOne({
      socket_id: socket.id,
      battletag: socket.handshake.session.user.battletag,
      current_matching_room_uuid: null
    })
    .then(function(r) {
      db.close();

      socket.join(socket.handshake.session.user.battletag);
    });
  });
});
