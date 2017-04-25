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
    db.collection('users').findOne({ battletag: req.body.battletag })
    .then(function(doc) {
      db.close();

      if (!doc) {
        res.send({
          state: 'fail',
          message: '접속하지 않은 사용자입니다'
        });

        return;
      }

      server_socket.in(req.body.battletag).emit('invite_to_party_matching_room', {
        invited_by: req.body.invited_by,
        invited_to: req.body.invited_to
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
