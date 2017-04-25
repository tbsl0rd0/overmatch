var _ = require('underscore');
var mongodb = require('../mongodb/mongodb');
var server_socket = require('./server_socket');

server_socket.on('connection', function(socket) {
  socket.on('disconnect', function(data) {
    mongodb.get_db(function(db) {
      db.collection('users').findOne({ socket_id: socket.id })
      .then(function(doc_2) {
        if (!doc_2) {
          db.close();

          return ;
        }

        db.collection('users').deleteOne({ socket_id: socket.id })
        .then(function(r) {
          if (!doc_2.current_matching_room_uuid) {
            db.close();

            return;
          }

          db.collection('matching_rooms').findOne({ uuid: doc_2.current_matching_room_uuid })
          .then(function(doc) {
            // 멤버리스트에 내 배틀태그가 없는 경우
            if (_.findIndex(doc.members, { battletag: doc_2.battletag }) == -1) {
              db.close();

              return;
            }

            // 멤버가 1명이고 내 배틀태그인 경우
            if (doc.members.length == 1 && doc.forever == false) {
              db.collection('matching_rooms').deleteOne({ uuid: doc_2.current_matching_room_uuid })
              .then(function(r) {
                db.close();

                server_socket.in('matching_room_board').emit('matching_room_board', {
                  command: 'remove_matching_room',
                  matching_room_uuid: doc_2.current_matching_room_uuid
                });
              });

              return;
            }

            // 멤버가 2명 이상이고 그중에 내 배틀태그가 있고 방장이 아닌 경우
            if (doc_2.battletag != doc.owner.battletag) {
              doc.members.splice(_.findIndex(doc.members, { battletag: doc_2.battletag }), 1);

              db.collection('matching_rooms').updateOne({ uuid: doc_2.current_matching_room_uuid }, { $set: { members: doc.members } })
              .then(function(r) {
                db.close();

                server_socket.in('matching_room_board').emit('matching_room_board', {
                  command: 'update_matching_room',
                  matching_room: doc
                });

                server_socket.in(doc_2.current_matching_room_uuid).emit('matching_room_board', {
                  command: 'update_current_matching_room',
                  matching_room: doc
                });
              });

              return;
            }

            // 멤버가 2명 이상이고 그중에 내 배틀태그가 있고 방장인 경우
            doc.members.splice(_.findIndex(doc.members, { battletag: doc_2.battletag }), 1);

            doc.owner = doc.members[0];

            db.collection('matching_rooms').updateOne({ uuid: doc_2.current_matching_room_uuid }, { $set: { owner: doc.owner, members: doc.members } })
            .then(function(r) {
              db.close();

              server_socket.in('matching_room_board').emit('matching_room_board', {
                command: 'update_matching_room',
                matching_room: doc
              });

              server_socket.in(doc_2.current_matching_room_uuid).emit('matching_room_board', {
                command: 'update_current_matching_room',
                matching_room: doc
              });
            });
          });
        });
      });
    });
  });
});
