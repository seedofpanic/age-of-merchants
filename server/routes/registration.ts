import {UserModel, User} from "../models/users";
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
  console.log('will search');
  UserModel.find({$or: [{email: new_user.email}, {username: new_user.username}]}).then(function (users) {
    if (users.length) {
      return res.send({result: false});
    }
    UserModel.create(new_user).then(function (user: User) {
      user.setPassword(req.body.reg_password);
      res.redirect('/');
    });
  })
      .catch(function (err) {
        console.log(err);
      });
});

module.exports = router;
