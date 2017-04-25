var _ = require('underscore');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.post('/', function(req, res, next) {
  if (!req.session.user && !req.body.from_lambda) {
    res.send({
      state: 'fail',
      message: '다시 로그인해 주세요'
    });

    return;
  }

  if (!req.body.title) {
    res.send({
      state: 'fail',
      message: '제목을 적어주세요'
    });

    return;
  }

  if (!req.body.url) {
    res.send({
      state: 'fail',
      message: 'URL이나 Script를 적어주세요'
    });

    return;
  }

  if (req.body.emotions.humorous == false && req.body.emotions.angry == false && req.body.emotions.sad == false && req.body.emotions.exciting == false && req.body.emotions.lovely == false && req.body.emotions.touching == false && req.body.emotions.academic == false) {
    res.send({
      state: 'fail',
      message: '감정 태그를 적어도 하나 이상 선택해주세요'
    });

    return;
  }

  var user =  {
    battletag: req.body.from_lambda == true ? req.body.battletag : req.session.user.battletag,
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

  var type = null;
  var exec = null;

  if (/^https:\/\/www\.youtube\.com/.test(req.body.url)) {
    type = 'youtube';

    exec = /v=(.{11})/.exec(req.body.url);
  }
  else if (/^https:\/\/youtu\.be/.test(req.body.url)) {
    type = 'youtube';

    exec = /^https:\/\/youtu\.be\/(.{11})/.exec(req.body.url);
  }
  else if (/src="https:\/\/www\.youtube\.com/.test(req.body.url)) {
    type = 'youtube';

    exec = /src="https:\/\/www\.youtube\.com\/embed\/(.{11})/.exec(req.body.url);
  }
  else {
    res.send({
      state: 'fail',
      message: '잘못된 URL이거나 잘못된 Script입니다'
    });

    return;
  }

  if (!exec) {
    res.send({
      state: 'fail',
      message: '잘못된 URL이거나 잘못된 Script입니다'
    });

    return;
  }

  var video_id = exec[1]

  var hash = crypto.createHash('sha256');
  hash.update(req.body.title + type + video_id);
  var hash_digest = hash.digest('hex');

  mongodb.get_db(function(db) {
    db.collection('video_posts').find({}, { hash_digest: 1 }).sort({ date: -1 }).limit(16).toArray(function(error, docs) {
      var hash_digest_list = _.pluck(docs, 'hash_digest');

      if (_.contains(hash_digest_list, hash_digest)) {
        db.close();

        res.send({
          state: 'fail',
          message: '이미 존재하는 게시물입니다'
        });

        return;
      }

      var cipher = crypto.createCipher('aes256', 'hctamrevo');
      var encrypted_ip = cipher.update(req.ip, 'utf8', 'hex');
      encrypted_ip += cipher.final('hex');

      db.collection('video_posts').insertOne({
        title: req.body.title,
        user: user,
        is_anonymous: req.body.is_anonymous,
        type: type,
        video_id: video_id,
        hash_digest: hash_digest,
        category: req.body.category,
        emotions: req.body.emotions,
        points: 0,
        plus_list: [],
        minus_list: [],
        score: 0,
        replies: [],
        encrypted_ip: encrypted_ip,
        date: date
      })
      .then(function(result) {
        db.close();

        res.send({
          state: 'success'
        });
      });
    });
  });
});

module.exports = router;
