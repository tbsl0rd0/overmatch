var express = require('express');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');

router.get('/', function(req, res, next) {
  mongodb.get_db(function(db) {
    db.collection('public_chat_messages').find({}).sort({ date: -1 }).limit(50).toArray(function(error, docs) {
      db.close();

      res.send({
        messages: docs
      });
    });
  });
});

module.exports = router;
