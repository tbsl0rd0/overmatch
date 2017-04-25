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
      var index = _.findIndex(doc.replies, { _id: req.body.reply__id });

      if (index == -1) {
        db.close();

        res.send({
          state: 'fail',
          message: '댓글을 찾을 수 없습니다'
        });

        return;
      }

      if (req.session.user.battletag == doc.replies[index].battletag) {
        db.close();

        if (req.body.type == 'plus') {
          res.send({
            state: 'fail',
            message: '자신의 글은 플러스할 수 없습니다'
          });

          return;
        }
        else if (req.body.type == 'minus') {
          res.send({
            state: 'fail',
            message: '자신의 글은 마이너스할 수 없습니다'
          });

          return;
        }
      }

      if (_.indexOf(doc.replies[index].plus_list, req.session.user.battletag) != -1) {
        db.close();

        res.send({
          state: 'fail',
          message: '이미 플러스했습니다'
        });

        return;
      }

      if (_.indexOf(doc.replies[index].minus_list, req.session.user.battletag) != -1) {
        db.close();

        res.send({
          state: 'fail',
          message: '이미 마이너스했습니다'
        });

        return;
      }

      if (req.body.type == 'plus') {
        doc.replies[index].points++;
        doc.replies[index].plus_list.push(req.session.user.battletag);
      }
      else if (req.body.type == 'minus') {
        doc.replies[index].points--;
        doc.replies[index].minus_list.push(req.session.user.battletag);
      }

      db.collection('video_posts').updateOne({ _id: mongodb.mongodb.ObjectId(req.body.video_post__id) }, { $set: { replies: doc.replies } })
      .then(function(result) {
        db.close();

        server_socket.in('videos_board').emit('update_video_post_reply_points', {
          video_post__id: req.body.video_post__id,
          reply__id: req.body.reply__id,
          points: doc.replies[index].points,
          plus_list: doc.replies[index].plus_list,
          minus_list: doc.replies[index].minus_list
        });

        res.send({
          state: 'success'
        });
      });
    });
  });
});

module.exports = router;
