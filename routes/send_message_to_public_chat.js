var _ = require('underscore');
var crypto = require('crypto');
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

  var user = _.clone(req.session.user);
  var date = new Date();

  if (req.body.is_anonymous == true) {
    var cipher = crypto.createCipher('aes256', req.ip + date.getDate());
    user.encrypted_battletag = cipher.update(user.battletag, 'utf8', 'hex');
    user.encrypted_battletag += cipher.final('hex');

    user.battletag = null;

    user.anonymous_battletag = '익명#' + user.encrypted_battletag.slice(0, 8);
  }

  var cipher = crypto.createCipher('aes256', 'hctamrevo');
  var encrypted_ip = cipher.update(req.ip, 'utf8', 'hex');
  encrypted_ip += cipher.final('hex');

  var message = {
    message: req.body.message,
    user: user,
    stat_by: req.body.stat_by,
    is_anonymous: req.body.is_anonymous,
    encrypted_ip: encrypted_ip,
    date: date
  };

  mongodb.get_db(function(db) {
    db.collection('public_chat_messages').insertOne(message)
    .then(function(result) {
      db.close();

      server_socket.in('public_chat').emit('add_message_to_public_chat', {
        message: message
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
