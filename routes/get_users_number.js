var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.get('/', function(req, res, next) {
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
    db.collection('users').find({}).count(function(error, count) {
      db.close();

      res.send({
        state: 'success',
        users_number: count
      });
    });
  });
});

module.exports = router;
