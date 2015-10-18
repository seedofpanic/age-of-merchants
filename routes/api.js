var express = require('express');
var router = express.Router();
var models = require('../lib/models');

router.get('/buildings', function(req, res, next) {
  models.buildings.find({}, function (err, buildings) {
    res.send(buildings);
    next();
  })
});

router.get('/profiles', function(req, res, next){
  models.profiles.find({user_id: req.user.id}, function (err, profile) {
    res.send(profile);
    next();
  });
});

router.post('/profile/new', function(req, res, next){
  var new_profile = {
    user_id: req.user.id,
    name: req.body.name,
    gold: 1000
  };
  models.profiles.create(new_profile, function (err, profile) {
    if (err) {
      console.log(err);
    }
    res.send(profile);
    next();
  });
});

module.exports = router;
