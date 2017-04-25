var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    next();

    return;
  }

  if (req.session.user.type != 'admin') {
    next();

    return;
  }

  res.render('admin', {
    css: process.env.NODE_ENV != 'production' ? '/admin/css/css.min.css' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/distribution/admin/css/css.min.css?v=c0soy95b',
    javascript: process.env.NODE_ENV != 'production' ? '/admin/javascripts/javascript.min.js' : 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/distribution/admin/javascripts/javascript.min.js?v=c0soy95b'
  });
});

module.exports = router;
