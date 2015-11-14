var express = require('express');
var router = express.Router();
var models = require('../models/index');

router.post('/', function(req, res, next) {
  var new_user = {
    email: req.body.reg_email,
    username: req.body.reg_username,
    password: ''
  };
  models.users.find({where: {$or: [{email: req.body.reg_email}, {username: req.body.reg_username}]}}).then(function (user) {
    models.users.create(new_user).then(function (user) {
      user.setPassword(req.body.reg_password);
      res.redirect('/');
    });
  });
});

module.exports = router;
