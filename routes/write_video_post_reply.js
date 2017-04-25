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

  if (!req.body.reply) {
    res.send({
      state: 'fail',
      message: '댓글을 써주세요'
    });

    return;
  }

  var user =  {
    battletag: req.session.user.battletag,
    encrypted_battletag: null,
    anonymous_battletag: null
  };

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

  var reply = {
    _id: mongodb.mongodb.ObjectId().toString(),
    reply: req.body.reply,
    user: user,
    is_anonymous: req.body.is_anonymous,
    points: 0,
    plus_list: [],
    minus_list: [],
    encrypted_ip: encrypted_ip,
    date: new Date()
  };

  mongodb.get_db(function(db) {
    db.collection('video_posts').findOne({ _id: mongodb.mongodb.ObjectId(req.body.video_post__id) })
    .then(function(doc) {
      doc.replies.push(reply);

      db.collection('video_posts').updateOne({ _id: mongodb.mongodb.ObjectId(req.body.video_post__id) }, { $set: { replies: doc.replies } })
      .then(function(result) {
        db.close();

        server_socket.in('videos_board').emit('add_reply', {
          video_post__id: req.body.video_post__id,
          reply: reply
        });

        res.send({
          state: 'success'
        });
      });
    });
  });
});

module.exports = router;
