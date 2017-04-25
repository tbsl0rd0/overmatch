var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');
var server_socket = require('../server/socket/server_socket');

router.post('/', function(req, res, next) {
  if (!req.session.user) {
    res.send({
      state: 'fail',
      message: '다시 로그인해 주세요'
    });

    return;
  }

  mongodb.get_db(function(db) {
    db.collection('matching_rooms').updateOne({ uuid: req.body.matching_room_uuid }, { $set: { title: req.body.title, max_personnel: req.body.max_personnel, category: req.body.category, mic: req.body.mic, wanted: req.body.wanted } })
    .then(function(result) {
      return db.collection('matching_rooms').findOne({ uuid: req.body.matching_room_uuid })
    })
    .then(function(doc) {
      db.close();

      server_socket.in('matching_room_board').emit('matching_room_board', {
        command: 'update_matching_room',
        matching_room: doc
      });

      server_socket.in(req.body.matching_room_uuid).emit('matching_room_board', {
        command: 'update_current_matching_room',
        matching_room: doc
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
