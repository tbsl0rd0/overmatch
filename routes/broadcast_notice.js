var express = require('express');
var router = express.Router();
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

  server_socket.emit('notice', {
    command: 'broadcast_notice',
    notice: req.body.notice
  });

  res.send({
    state: 'success'
  });
});

module.exports = router;
