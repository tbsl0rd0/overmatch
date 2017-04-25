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

  var message = {
    user: req.session.user,
    stat_by: req.body.stat_by,
    message: req.body.message,
    matching_room_uuid: req.body.matching_room_uuid,
    date: new Date()
  }

  server_socket.in(req.body.matching_room_uuid).emit('send_message_to_matching_room_chat', {
    message: message
  });

  res.send({
    state: 'success'
  });
});

module.exports = router;
