var express = require('express');
var router = express.Router();
var passport = require('../server/passport/passport');

router.get('/', function(req, res, next) {
  res.redirect('/battlenet_callback');
});

module.exports = router;
