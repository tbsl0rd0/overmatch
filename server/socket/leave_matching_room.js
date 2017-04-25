var _ = require('underscore');
var mongodb = require('../mongodb/mongodb');
var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('leave_matching_room', function(data) {
    if (!socket.handshake.session.user) {
      return;
    }

    mongodb.get_db(function(db) {
      db.collection('users').updateOne({ socket_id: socket.id }, { $set: { current_matching_room_uuid: null } })
      .then(function(r) {
        socket.leave(data.matching_room_uuid);

        return db.collection('matching_rooms').findOne({ uuid: data.matching_room_uuid });
      })
      .then(function(doc) {
        // 멤버리스트에 내 배틀태그가 없는 경우
        if (_.findIndex(doc.members, { battletag: socket.handshake.session.user.battletag }) == -1) {
          db.close();

          return;
        }

        // 멤버가 1명이고 내 배틀태그인 경우
        if (doc.members.length == 1 && doc.forever == false) {
          db.collection('matching_rooms').deleteOne({ uuid: data.matching_room_uuid })
          .then(function(r) {
            db.close();

            server_socket.in('matching_room_board').emit('matching_room_board', {
              command: 'remove_matching_room',
              matching_room_uuid: data.matching_room_uuid
            });
          });

          return;
        }

        // 멤버가 2명 이상이고 그중에 내 배틀태그가 있고 방장이 아닌 경우
        if (socket.handshake.session.user.battletag != doc.owner.battletag) {
          doc.members.splice(_.findIndex(doc.members, { battletag: socket.handshake.session.user.battletag }), 1);

          db.collection('matching_rooms').updateOne({ uuid: data.matching_room_uuid }, { $set: { members: doc.members } })
          .then(function(r) {
            db.close();

            server_socket.in('matching_room_board').emit('matching_room_board', {
              command: 'update_matching_room',
              matching_room: doc
            });

            server_socket.in(data.matching_room_uuid).emit('matching_room_board', {
              command: 'update_current_matching_room',
              matching_room: doc
            });
          });

          return;
        }

        // 멤버가 2명 이상이고 그중에 내 배틀태그가 있고 방장인 경우
        doc.members.splice(_.findIndex(doc.members, { battletag: socket.handshake.session.user.battletag }), 1);

        doc.owner = doc.members[0];

        db.collection('matching_rooms').updateOne({ uuid: data.matching_room_uuid }, { $set: { owner: doc.owner, members: doc.members } })
        .then(function(r) {
          db.close();

          server_socket.in('matching_room_board').emit('matching_room_board', {
            command: 'update_matching_room',
            matching_room: doc
          });

          server_socket.in(data.matching_room_uuid).emit('matching_room_board', {
            command: 'update_current_matching_room',
            matching_room: doc
          });
        });
      });
    });
  });
});
