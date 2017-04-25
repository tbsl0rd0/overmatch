var express = require('express');
var router = express.Router();
var passport = require('../server/passport/passport');

router.get('/', passport.authenticate('bnet'));

module.exports = router;
