var express = require('express');
var router = express.Router();
var models = require('../lib/models');

router.get('/buildings', function(req, res, next) {
  models.profiles.one({name: req.query.profile_name}, function (err, profile) {
    if (err || !profile.id) {
      return
    }
    models.buildings.find({profile_id: profile.id}, function (err, buildings){
      res.send(buildings);
    })
  });
});

router.post('/buildings/new', function(req, res, next){
  if (!req.user) {return;}
  models.fields.one({region_id: req.body.region, x: req.body.x, y: req.body.y}, function (err, field) {
    if (err) {
      console.log(err);
      console.log(req.body);
      return;
    }
    models.profiles.one({name: req.body.profile_name, user_id: req.user.id}, function(err, profile) {
      if (err) {
        console.log(err);
        return;
      }
      var new_building = {
        profile_id: profile.id,
        type: req.body.type,
        name: req.body.name,
        field_id: field.id,
        buildtime: models.buildings.types.params[req.body.type].build_time,
        status: 0
      };
      models.buildings.create(new_building, function (err, building) {
        if (err) {
          console.log(err);
        }
        res.send(building);
      });
    });
  });
});

/*router.get('/buildings/types', function(req, res, next) {
  res.send(models.buildings.types.types);
});*/

router.get('/profiles', function(req, res, next){
  models.profiles.find({user_id: req.user.id}, function (err, profile) {
    res.send(profile);
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
  });
});

router.get('/regions', function(req, res, next){
  models.regions.find({}, function (err, regions) {
    res.send(regions);
  });
});

router.get('/goods', function(req, res, next){
  models.goods.find({building_id: req.query.building_id}, function (err, goods) {
    res.send(goods);
  });
});


module.exports = router;
