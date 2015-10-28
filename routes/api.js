var express = require('express');
var router = express.Router();
var models = require('../models/index');

router.get('/profile', function(req, res, next) {
  models.profiles.find({where: {name: req.query.name}}).then(function (profile) {
    res.send(profile);
  });
});

router.get('/buildings', function(req, res, next) {
  models.profiles.find({where: {name: req.query.profile_name}}).then(function (profile) {
    models.buildings.findAll({where: {profile_id: profile.id}, include: [models.fields]}).then(function (buildings){
      res.send(buildings);
    })
  });
});

router.post('/buildings/new', function(req, res, next){
  if (!req.user) {return;}
  models.profiles.find({where: {name: req.body.profile_name, user_id: req.user.id}}).then(function(profile) {
    models.buildings.new(profile, req.body.region, req.body.x, req.body.y, req.body.type, req.body.name, function (err, building) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      building.getField().then(function (field) {
        var data = building.get();
        data.field = field.get();
        res.send(data);
      });
    });
  });
});

router.get('/profiles', function(req, res, next){
  models.profiles.findAll({where: {user_id: req.user.id}}).then(function (profile) {
    res.send(profile);
  });
});

router.post('/profile/new', function(req, res, next){
  var new_profile = {
    user_id: req.user.id,
    name: req.body.name,
    gold: 1000
  };
  models.profiles.create(new_profile).then(function (profile) {
    res.send(profile);
  });
});

router.get('/regions', function(req, res, next){
  models.regions.findAll({}).then(function (regions) {
    res.send(regions);
  });
});

router.get('/products', function(req, res, next){
  if (req.query.building_id) {
    models.products.findAll({where: {building_id: req.query.building_id}}).then(function (products) {
      res.send(products);
    });
  } else {
    models.products.findAll({where: {'export': true}}).then(function (err, products) {
      res.send(products);
    });
  }
});

router.post('/product/start_export', function(req, res, next){
  //TODO: check profile access
  models.products.findById(req.body.id).then(function (product) {
    product.export = req.body.export;
    product.export_count = req.body.export_count;
    product.price = req.body.price;
    product.save();
    res.send(product);
  });
});

router.post('/product/stop_export', function(req, res, next){
  //TODO: check profile access
  models.products.findById(req.body.id).then(function (product) {
    product.export = 0;
    product.save();
    res.send(product);
  });
});

router.post('/contracts/new', function(req, res, next){
  //TODO: check profile access
  var new_contract = {
    product_id: req.body.product.id,
    dest_id: req.body.building_id,
    count: req.body.count,
    type: req.body.type
  };
  models.contracts.create(new_contract).then(function (contract) {
    res.send(contract);
  });
});

router.get('/map', function (req, res, next) {
  var map = [];
  var type = models.fields_resources.types[req.query.type];
  models.fields.findAll({where: {region_id: req.query.region_id}, include: [{model: models.fields_resources, as: 'res', attributes: [[type + '_c', 'c'], [type + '_q', 'q'], [type + '_a', 'a']]}]}).then(function (fields) {
    for (var i = 0; i < fields.length; i++) {
      if (!map[fields[i].x]) {
        map[fields[i].x] = [];
      }
      map[fields[i].x][fields[i].y] = fields[i];
    }
    res.send(map);
  });
});
module.exports = router;
