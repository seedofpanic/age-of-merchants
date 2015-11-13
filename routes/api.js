var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');

router.get('/profile', function(req, res, next) {
  models.profiles.find({where: {name: req.query.name}}).then(function (profile) {
    res.send(profile);
  });
});

router.get('/buildings/types', function(req, res, next) {
  var types = [];
  res.send(models.buildings.params);
});

router.get('/buildings', function(req, res, next) {
  models.profiles.find({where: {name: req.query.profile_name}}).then(function (profile) {
    models.buildings.findAll({where: {profile_id: profile.id}, include: [models.fields]}).then(function (buildings){
      res.send(buildings);
    })
  });
});

router.get('/troops', function(req, res, next) {
  models.profiles.find({where: {name: req.query.profile_name}}).then(function (profile) {
    models.troops.findAll({
      attributes: ['id', ['(SELECT count(*) FROM `troops` as t WHERE t.`field_id`=`troops`.`field_id` and t.id != `troops`.`id`)', 'neighbors']],
      where: {profile_id: profile.id}, include: [models.fields, {model: models.troops_moves, as: 'move', include: [models.fields]}]
    }).then(function (troops){
      res.send(troops);
    })
  });
});

router.get('/troops/field', function(req, res, next) {
  var troop_id = req.query.troop_id;
  var field_id = req.query.field_id;
  models.troops.findAll({
    where: {field_id: field_id, $not: {id: troop_id}}, include: [{model: models.profiles}]
  }).then(function (troops){
    var data = [];
    var pendings = troops.length;
    troops.forEach(function (troop) {
      var row_troop = troop.get();
      troop.getAssaults().then(function (assaults) {
        row_troop.assaults = assaults;
        data.push(row_troop);
        pendings--;
        if (pendings == 0) {
          res.send(data);
        }
      });
    });
  })
});

router.post('/troop/move', function(req, res, next) {
  var troop = req.body;
  models.fields.find({where: {region_id: troop.move.field.region_id, x: troop.move.field.x, y: troop.move.field.y}})
      .then(function (field){
        var new_move = {
          troop_id: troop.id,
          field_id: field.id
        };
        models.troops_moves.create(new_move).then(function (move) {
          var data = move.get();
          data.field = field.get();
          res.send(data);
        });
      })
});
router.post('/troop/stop', function(req, res, next) {
  var troop_id = req.body.troop_id;
  models.troops_moves.destroy({where: {troop_id: troop_id}}).then(function () {
    res.send({})
  });
});

router.post('/buildings/new', function(req, res, next){
  if (!req.user) {return;}
  models.profiles.find({where: {name: req.body.profile_name, user_id: req.user.id}}).then(function(profile) {
    models.buildings.new({
        profile: profile,
        region_id: req.body.region,
        x: req.body.x,
        y: req.body.y,
        type: req.body.type,
        name: req.body.name,
        out_type: req.body.out_type
      }, function (err, building) {
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
  models.profiles.find({where: {name: new_profile.name}}).then(function (profile) {
    if (!profile) {
      models.profiles.create(new_profile).then(function (profile) {
        res.send(profile);
      });
    } else {
      res.status(500).send('Account with such name already exists!');
    }
  })
});

router.get('/regions', function(req, res, next){
  models.regions.findAll({}).then(function (regions) {
    res.send(regions);
  });
});

router.get('/products/humans', function(req, res, next){
  if (req.query.building_id) {
    models.products.find({attributes: ['id', 'count', 'quality'], where: {building_id: req.query.building_id, product_type: 3}}).then(function (result) {
      res.send(result);
    });
  }
});

router.get('/products', function(req, res, next){
  if (req.query.building_id) {
    models.products.findAll({where: {building_id: req.query.building_id}}).then(function (products) {
      res.send(products);
    });
  }
});

router.get('/products/import', function(req, res, next){
  models.products.findAll({where: {'export': true}}).then(function (products) {
    res.send(products);
  });
});

router.get('/products/import/my', function(req, res, next){
  models.products.findAll({include:
      {model: models.buildings, attributes: [], required: true, include: {model: models.profiles, attributes: [], required: true, include: {model: models.users, attributes: [], required: true, where: {id: req.user.id}}}}
    }).then(function (products) {
      res.send(products);
  });
});

router.get('/army', function(req, res, next){
  if (req.query.building_id) {
    models.products.findAll({where: {building_id: req.query.building_id, is_army: true}}).then(function (products) {
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

router.post('/troops/new', function(req, res, next){
  models.profiles.find({where: {name: req.body.profile_name}}).then(function (profile) {
    var building_id = req.body.building_id;
    models.buildings.find({where: {id: building_id}}).then(function (building) {
      var new_troop = {
        profile_id: profile.id,
        field_id: building.field_id
      };
      models.troops.create(new_troop).then(function (troop) {
        var soldiers = req.body.soldiers;
        soldiers.forEach(function (soldier) {
          models.products.find({where: {id: soldier.id}}).then(function (product) {
            soldier.recruit = soldier.recruit > product.count ? product.count : soldier.recruit;
            product.count -= soldier.recruit;
            product.save();
            var new_soldier = {
              troop_id: troop.id,
              product_type: product.product_type,
              count: soldier.recruit,
              quality: product.quality
            };
            models.soldiers.create(new_soldier);
          });
        });
        res.send(troop);
      });
    });
  });
});


router.get('/map', function (req, res, next) {
  var map = [];
  type = parseInt(req.query.type);
  if (type == 0) {
    return;
  }
  models.fields.findAll({where: {region_id: req.query.region_id}, include: [{model: models.fields_resources, as: 'res', attributes: ['c', 'q', 'a'], where: {type: type}}]}).then(function (fields) {
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

router.post('/troops/attack', function (req, res, next) {
  var troop_id = req.body.troop_id;
  var target_id = req.body.target_id;
  models.troops_attacks.findOrCreate({where: {troop_id: troop_id, target_id: target_id}, defaults: {troop_id: troop_id, target_id: target_id}}).then(function (){
    res.send('ok');
  });
});

router.post('/troops/stop_attack', function (req, res, next) {
  var troop_id = req.body.troop_id;
  var target_id = req.body.target_id;
  models.troops_attacks.destroy({where: {troop_id: troop_id, target_id: target_id}}).then(function (){
    res.send('ok');
  });
});

router.post('/buildings/employ', function (req, res, next) {
  var id = req.body.id;
  var count = req.body.count;
  var building_id = req.body.building_id;
  models.products.find({where: {id: id, building_id: building_id}}).then(function (product) {
    product.take(count, function (taken) {
      models.buildings.find({where: {id: building_id}}).then(function (building) {
        building.workers_q = (building.workers_q * building.workers_c + taken.count * taken.quality) / (building.workers_c + taken.count)
        building.workers_c = taken.count;
      })
    });
  });
});