var uuid = require('uuid/v1');
var mongodb = require('../mongodb/mongodb');
var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('create_matching_room', function(data) {
    if (!socket.handshake.session.user) {
      socket.emit('create_matching_room', {
        state: 'fail',
        message: '다시 로그인해 주세요'
      });

      return;
    }

    var matching_room = {
      uuid : uuid(),
      title: data.title,
      max_personnel: data.max_personnel,
      category: data.category,
      mic: data.mic,
      wanted: data.wanted,
      owner: socket.handshake.session.user,
      members: [socket.handshake.session.user]
    };

    mongodb.get_db(function(db) {
      db.collection('matching_rooms').insertOne(matching_room)
      .then(function(result) {
        socket.join(matching_room.uuid);

        server_socket.in('matching_room_board').emit('matching_room_board', {
          command: 'add_matching_room',
          matching_room: matching_room
        });

        socket.emit('create_matching_room', {
          state: 'success',
          matching_room: matching_room
        });

        return db.collection('users').updateOne({ socket_id: socket.id }, { $set: { current_matching_room_uuid: matching_room.uuid } });
      })
      .then(function(result) {
        db.close();
      });
    });
  });
});
