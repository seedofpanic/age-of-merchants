var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.user ? req.user : {};
  res.render('layout', { user: {id: user.id, username: user.username }});
});

module.exports = router;
