var express = require('express');
var router = express.Router();
var models = require('../lib/models');

router.post('/', function(req, res, next) {
  var new_user = {
    email: req.body.reg_email,
    username: req.body.reg_username,
    password: ''
  };
  models.users.create(new_user, function (err, user) {
    console.log(err);
    user.setPassword(req.body.reg_password);
  });
  res.redirect('/');
});

module.exports = router;
