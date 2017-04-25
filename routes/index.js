var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    css: process.env.NODE_ENV != 'production' ? '/index/css/css.min.css' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/dist/index/css/css.min.css?v=c0soy95m',
    js: process.env.NODE_ENV != 'production' ? '/index/js/js.min.js' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/dist/index/js/js.min.js?v=c0soy95m'
  });
});

module.exports = router;
