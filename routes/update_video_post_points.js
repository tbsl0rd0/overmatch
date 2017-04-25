var _ = require('underscore');
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
    db.collection('video_posts').findOne({ _id: mongodb.mongodb.ObjectId(req.body.video_post__id) })
    .then(function(doc) {
      if (doc.battletag == req.session.user.battletag) {
        db.close();

        if (req.body.type == 'plus') {
          res.send({
            state: 'fail',
            message: '자신의 글은 플러스할 수 없습니다'
          });
        }
        else if (req.body.type == 'minus') {
          res.send({
            state: 'fail',
            message: '자신의 글은 마이너스할 수 없습니다'
          });
        }

        return;
      }

      if (_.indexOf(doc.plus_list, req.session.user.battletag) != -1) {
        db.close();

        res.send({
          state: 'fail',
          message: '이미 플러스했습니다'
        });

        return;
      }

      if (_.indexOf(doc.minus_list, req.session.user.battletag) != -1) {
        db.close();

        res.send({
          state: 'fail',
          message: '이미 마이너스했습니다'
        });

        return;
      }

      if (req.body.type == 'plus') {
        doc.points++;
        doc.plus_list.push(req.session.user.battletag);
        doc.score++;
      }
      else if (req.body.type == 'minus') {
        doc.points--;
        doc.minus_list.push(req.session.user.battletag);
        doc.score--;
      }

      db.collection('video_posts').updateOne({ _id: mongodb.mongodb.ObjectId(req.body.video_post__id) }, { $set: { points: doc.points, plus_list: doc.plus_list, minus_list: doc.minus_list, score: doc.score } })
      .then(function(result) {
        db.close();

        server_socket.in('videos_board').emit('update_video_post_points', {
          video_post__id: req.body.video_post__id,
          points: doc.points,
          plus_list: doc.plus_list,
          minus_list: doc.minus_list
        });

        res.send({
          state: 'success'
        });
      });
    });
  });
});

module.exports = router;
