var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.get('/', function(req, res, next) {
  mongodb.get_db(function(db) {
    db.collection('notices').find({}).toArray(function(error, docs) {
      db.close();

      res.send({
        notices: docs
      });
    });
  });
});

module.exports = router;
