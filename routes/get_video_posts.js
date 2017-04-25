var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.post('/', function(req, res, next) {
  mongodb.get_db(function(db) {
    var sort = null;

    if (req.body.order == 'recent') {
      sort = {
        date: -1
      };
    }
    else if (req.body.order == 'best') {
      sort = {
        score: -1,
        date: -1
      };
    }

    db.collection('video_posts').find({}).sort(sort).skip((req.body.page - 1) * 8).limit(8).toArray(function(error, docs) {
      db.close();

      res.send({
        video_posts: docs
      });
    });
  });
});

module.exports = router;
