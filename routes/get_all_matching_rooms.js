var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.get('/', function(req, res, next) {
  mongodb.get_db(function(db) {
    db.collection('matching_rooms').find({}).toArray(function(error, docs) {
      db.close();

      res.send({
        matching_rooms: docs
      });
    });
  });
});

module.exports = router;
