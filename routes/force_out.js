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
    db.collection('matching_rooms').findOne({ uuid: req.body.matching_room_uuid })
    .then(function(doc) {
      if (!doc) {
        db.close();

        res.send({
          state: 'fail',
          message: '방이 존재하지 않습니다'
        });

        return;
      }

      if (req.session.user.battletag != doc.owner.battletag) {
        db.close();

        res.send({
          state: 'fail',
          message: '방장이 아닙니다'
        });

        return;
      }

      db.close();

      server_socket.in(req.body.battletag).emit('force_out', {
        matching_room_uuid: req.body.matching_room_uuid
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
