var _ = require('underscore');
var mongodb = require('../mongodb/mongodb');
var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('join_matching_room', function(data) {
    if (!socket.handshake.session.user) {
      socket.emit('matching_room_board', {
        command: 'join_matching_room',
        state: 'fail',
        message: '다시 로그인해 주세요'
      });

      return;
    }

    mongodb.get_db(function(db) {
      db.collection('matching_rooms').findOne({ uuid: data.matching_room_uuid })
      .then(function(doc) {
        if (!doc) {
          db.close();

          socket.emit('matching_room_board', {
            command: 'join_matching_room',
            state: 'fail',
            message: '방이 존재하지 않습니다'
          });

          return;
        }

        if (doc.members.length >= doc.max_personnel) {
          db.close();

          socket.emit('matching_room_board', {
            command: 'join_matching_room',
            state: 'fail',
            message: '인원이 꽉 찼습니다'
          });

          return;
        }

        if (_.some(doc.members, function(member) {
          return member.battletag == socket.handshake.session.user.battletag;
        })) {
          db.close();

          socket.emit('matching_room_board', {
            command: 'join_matching_room',
            state: 'fail',
            message: '이미 참여중인 방입니다'
          });

          return;
        }

        doc.members.push(socket.handshake.session.user);

        db.collection('matching_rooms').updateOne({ uuid: data.matching_room_uuid }, { $set: { members: doc.members } })
        .then(function(result) {
          socket.join(data.matching_room_uuid);

          server_socket.in('matching_room_board').emit('matching_room_board', {
            command: 'update_matching_room',
            matching_room: doc
          });

          socket.in(data.matching_room_uuid).emit('matching_room_board', {
            command: 'update_current_matching_room',
            matching_room: doc
          });

          socket.emit('matching_room_board', {
            command: 'join_matching_room',
            state: 'success',
            matching_room: doc
          });

          return db.collection('users').updateOne({ socket_id: socket.id }, { $set: { current_matching_room_uuid: data.matching_room_uuid } });
        })
        .then(function(result) {
          db.close();
        });
      });
    });
  });
});
