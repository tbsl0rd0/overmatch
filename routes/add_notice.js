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
    db.collection('notices').insertOne({ notice: req.body.notice })
    .then(function(result) {
      db.close();

      var notice = {
        _id: result.insertedId,
        notice: req.body.notice
      }

      server_socket.emit('notice', {
        command: 'add_notice',
        notice: notice
      });

      res.send({
        state: 'success',
        notice: notice
      });
    });
  });
});

module.exports = router;
