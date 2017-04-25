var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    css: process.env.NODE_ENV != 'production' ? '/index/css/css.min.css' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/distribution/index/css/css.min.css?v=c0soy95b',
    javascript: process.env.NODE_ENV != 'production' ? '/index/javascripts/javascript.min.js' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/distribution/index/javascripts/javascript.min.js?v=c0soy95b'
  });
});

module.exports = router;
