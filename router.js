//server/routes/routes.js
var express = require('express');
var router = express.Router();

router.get('/*', function(req, res){
  res.render('src/index', {
    BUNDLE_URI: process.env.mode == 'local' ? 'http://localhost:8080' : ''
  });
});

module.exports = router;