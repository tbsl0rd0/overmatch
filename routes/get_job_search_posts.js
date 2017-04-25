var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.get('/', function(req, res, next) {
  mongodb.get_db(function(db) {
    db.collection('job_search_posts').find({}).toArray(function(error, docs) {
      db.close();

      res.send({
        job_search_posts: docs
      });
    });
  });
});

module.exports = router;
