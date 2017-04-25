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

  if (req.session.user.type != 'admin') {
    res.send({
      state: 'fail',
      message: '관리자가 아닙니다'
    });

    return;
  }

  mongodb.get_db(function(db) {
    db.collection('notices').deleteOne({ _id: mongodb.mongodb.ObjectID(req.body.notice__id) })
    .then(function(result) {
      db.close();

      server_socket.emit('notice', {
        command: 'remove_notice',
        notice__id: req.body.notice__id
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
