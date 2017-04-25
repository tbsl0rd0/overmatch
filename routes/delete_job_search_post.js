var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');
var server_socket = require('../server/socket/server_socket');

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    res.send({
      state: 'fail',
      message: '다시 로그인해 주세요'
    });

    return;
  }

  mongodb.get_db(function(db) {
    db.collection('job_search_posts').deleteOne({ 'user.battletag': req.session.user.battletag })
    .then(function(result) {
      db.close();

      server_socket.in('job_search_board').emit('job_search_board', {
        command: 'remove_job_search_post',
        battletag: req.session.user.battletag
      });

      res.send({
        state: 'success'
      });
    });
  });
});

module.exports = router;
