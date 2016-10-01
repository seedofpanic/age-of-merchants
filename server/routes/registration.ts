var express = require('express');
var router = express.Router();
var models = require('../models/index');
var jsesc = require('escape-html');

router.post('/', function(req, res, next) {
  var new_user = {
    email: jsesc(req.body.reg_email),
    username: jsesc(req.body.reg_username),
    password: ''
  };
  models.users.find({where: {$or: [{email: new_user.email}, {username: new_user.username}]}}).then(function (user) {
    models.users.create(new_user).then(function (user) {
      user.setPassword(req.body.reg_password);
      res.redirect('/');
    });
  });
});

module.exports = router;
