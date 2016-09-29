var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');
var jsesc = require('escape-html');

router.get('/profile', function(req, res, next) {
  check(models.profiles, parseInt(req.query.id), parseInt(req.user.id), res).then(function (profile) {
    res.send(profile);
  });
});

router.get('/user', function (req, res, next) {
  if (req.user) {
    res.send({id: req.user.id});
  } else {
    res.send({});
  }
});

router.get('/user/profile', function (req, res, next) {
  models.users.find({attributes: ['id', 'username', 'email', 'createdAt'],where: {id: req.user.id}}).then(function (data) {
    res.send(data);
  })
});

router.get('/buildings/types', function(req, res, next) {
  res.send(models.buildings.params);
});

router.get('/buildings', function(req, res, next) {
  models.profiles.find({where: {id: parseInt(req.query.profile_id)}}).then(function (profile) {
    models.buildings.findAll({where: {profile_id: profile.id}, include: [models.fields]}).then(function (buildings){
      res.send(buildings);
    })
  });
});

router.get('/users', function(req, res, next) {
  var limit = 10;
  var page = parseInt(req.query.page);
  var offset = ((page > -1) ? page : 0) * limit;
  models.users.find({attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]}).then(function (result){
    models.users.findAll({offset: offset, limit: limit, attributes: ['id', 'username', [sequelize.literal('(SELECT sum(gold) FROM profiles WHERE user_id=users.id)'), 'gold']], order: 'gold desc,id'}).then(function (users){
      data = {
        page: page,
        users: users,
        pages: Math.floor(result.get('count') / limit) + 1
      };
      res.send(data);
    });
  });
});

router.get('/troops', function(req, res, next) {
  models.profiles.find({where: {id: parseInt(req.query.profile_id)}}).then(function (profile) {
    if (!profile) {
      res.status(500).send();
      return;
    }
    check(models.profiles, profile.id, parseInt(req.user.id), res)
      .then(function () {
        return models.troops.findAll({
          attributes: ['id', ['(SELECT count(*) FROM `troops` as t WHERE t.`field_id`=`troops`.`field_id` and t.id != `troops`.`id`)', 'neighbors']],
          where: {profile_id: profile.id},
          include: [models.fields, {model: models.troops_moves, as: 'move', include: [models.fields]}]
        }).then(function (troops) {
          res.send(troops);
        })
      });
  });
});

router.get('/troops/field', function(req, res, next) {
  var troop_id = parseInt(req.query.troop_id);
  var field_id = parseInt(req.query.field_id);
  check(models.troops, troop_id, parseInt(req.user.id), res)
    .then(function (troop) {
      models.troops.findAll({
        where: {field_id: troop.field_id, $not: {id: troop.id}}, include: [{model: models.profiles}]
      }).then(function (troops) {
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
});

router.post('/troop/move', function(req, res, next) {
  var troop_id = parseInt(req.body.id);
  check(models.troops, troop_id, parseInt(req.user.id), res)
    .then(function (troop) {
      models.fields.find({where: {region_id: troop.move.field.region_id, x: troop.move.field.x, y: troop.move.field.y}})
      .then(function (field) {
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
});
router.post('/troop/stop', function(req, res, next) {
  var troop_id = parseInt(req.body.troop_id);
  check(models.troops, troop_id, parseInt(req.user.id), res)
    .then(function (troop) {
      models.troops_moves.destroy({where: {troop_id: troop.id}}).then(function () {
        res.send({})
      });
    });
});

function checkFieldCoord(coord) {
  if (coord < 0) {
    return 0;
  } else if (coord > 49) {
    return 49;
  } else {
    return coord;
  }
}

router.post('/buildings/new', function(req, res, next){
  var x = parseInt(req.body.x);
  var y = parseInt(req.body.y);
  var type = parseInt(req.body.type);
  var out_type = parseInt(req.body.out_type);
  var out_props = models.buildings.params[type].resources_out[out_type];
  if (!out_props) {
    res.status(500).send();
    return;
  }
  check(models.profiles, parseInt(req.body.profile_id), parseInt(req.user.id), res)
    .then(function (profile) {
      var new_building = {
        profile: profile,
        region_id: parseInt(req.body.region),
        x: checkFieldCoord(x),
        y: checkFieldCoord(y),
        type: type,
        name: jsesc(req.body.name),
        out_type: out_type,
        mode: out_props.mode
      };
      models.buildings.new(new_building)
        .then(function (err, building) {
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
  models.profiles.findAll({where: {user_id: parseInt(req.user.id)}}).then(function (profile) {
    res.send(profile);
  });
});

router.post('/profile/new', function(req, res, next){
  var new_profile = {
    user_id: parseInt(req.user.id),
    name: jsesc(req.body.name),
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
  var building_id = parseInt(req.query.building_id);
  check(models.buildings, building_id, parseInt(req.user.id), res)
    .then(function () {
      models.products.find({
        attributes: ['id', 'count', 'quality'],
        where: {building_id: parseInt(req.query.building_id), product_type: 3}
      }).then(function (result) {
        res.send(result);
      });
    });
});

router.get('/products', function(req, res, next){
  var building_id = parseInt(req.query.building_id);
  check(models.buildings, building_id, parseInt(req.user.id), res)
    .then(function () {
      models.products.findAll({where: {building_id: building_id}}).then(function (products) {
        res.send(products);
      });
    });
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
  var building_id = parseInt(req.query.building_id);
  check(models.buildings, building_id, parseInt(req.user.id), res)
    .then(function () {
      models.products.findAll({where: {building_id: building_id, is_army: true}}).then(function (products) {
        res.send(products);
      });
    });
});

router.post('/product/start_export', function(req, res, next){
  var product_id = parseInt(req.body.id);
  check(models.products, product_id, parseInt(req.user.id), res)
    .then(function () {
      models.products.findById(product_id).then(function (product) {
        product.export = req.body.export ? true : false;
        product.export_count = parseInt(req.body.export_count);
        product.price = parseFloat(req.body.price).toFixed(2);
        product.save();
        res.send(product);
      });
    });
});

router.post('/product/stop_export', function(req, res, next){
  var product_id = parseInt(req.body.id);
  check(models.products, product_id, req.user.id, res)
    .then(function () {
      models.products.findById(product_id).then(function (product) {
        product.export = 0;
        product.save();
        res.send(product);
      });
    });
});

router.post('/contracts/new', function(req, res, next){
  var new_contract = {
    product_id: parseInt(req.body.product.id),
    dest_id: parseInt(req.body.building_id),
    count: parseInt(req.body.count),
    type: parseInt(req.body.type)
  };
  check(models.products, new_contract.product_id, parseInt(req.user.id), res)
    .then(function () {
      newContract(new_contract, res);
    })
    .catch(function () {
      models.products.find({where: {id: new_contract.product_id, 'export': true}}).then(function (product) {
        if (!product) {
          res.status(500).send();
          return;
        }
        newContract(new_contract, res);
      });
    });
});

function newContract(new_contract, res) {
  models.contracts.create(new_contract).then(function (contract) {
    res.send(contract);
  });
}

router.post('/troops/new', function(req, res, next){
  check(models.profiles, parseInt(req.body.profile_id), parseInt(req.user.id), res)
    .then(function (profile) {
      var building_id = parseInt(req.body.building_id);
      models.buildings.find({where: {id: building_id, profile_id: profile.id}}).then(function (building) {
        if (!building) {
          res.status(500).send();
          return;
        }
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
  var type = parseInt(req.query.type)
  var sub_type = parseInt(req.query.sub_type);
  if (type == 0) {
    return;
  }
  if (type == 1) {
    models.fields.findAll({
      where: {region_id: parseInt(req.query.region_id)},
      include: [{model: models.fields_resources, as: 'res', attributes: ['c', 'q', 'a'], where: {type: sub_type}}]
    }).then(function (fields) {
      for (var i = 0; i < fields.length; i++) {
        if (!map[fields[i].x]) {
          map[fields[i].x] = [];
        }
        map[fields[i].x][fields[i].y] = fields[i];
      }
      res.send(map);
    });
  } else if (type == 2) {
    var and = '';
    if (sub_type != -2) {
      and = ' and mode=' + sub_type;
    }
    models.fields.findAll({
      where: {region_id: parseInt(req.query.region_id)},
      attributes: ['x', 'y', 'id', 'avg_salary',['(SELECT COUNT(*) FROM buildings where field_id=fields.id' + and + ')', 'c']]
    }).then(function (fields) {
      for (var i = 0; i < fields.length; i++) {
        if (!map[fields[i].x]) {
          map[fields[i].x] = [];
        }
        map[fields[i].x][fields[i].y] = fields[i];
      }
      res.send(map);
    });
  }
});
module.exports = router;

router.post('/troops/attack', function (req, res, next) {
  var troop_id = parseInt(req.body.troop_id);
  var target_id = parseInt(req.body.target_id);
  check(models.troops, troop_id, parseInt(req.user.id), res)
    .then(function (troop) {
      models.troops_attacks.findOrCreate({
        where: {troop_id: troop.id, target_id: target_id},
        defaults: {troop_id: troop.id, target_id: target_id}
      }).then(function () {
        res.send('ok');
      });
    })
});

router.post('/troops/stop_attack', function (req, res, next) {
  var troop_id = parseInt(req.body.troop_id);
  var target_id = parseInt(req.body.target_id);
  check(models.troops, troop_id, parseInt(req.user.id), res)
    .then(function (troop) {
      models.troops_attacks.destroy({where: {troop_id: troop.id, target_id: target_id}}).then(function () {
        res.send('ok');
      });
    });
});

router.post('/buildings/employ', function (req, res, next) {
  var id = parseInt(req.body.id);
  var count = parseInt(req.body.count);
  var salary = parseFloat(req.body.salary).toFixed(2);
  var building_id = parseInt(req.body.building_id);
  check(models.buildings, building_id, parseInt(req.user.id), res)
    .then(function (building) {
      if (id) {
        models.products.find({where: {id: id, building_id: building_id}}).then(function (product) {
          product.take(count, function (taken) {
            building.workers_q = (building.workers_q * building.workers_c + taken.count * taken.quality) / (building.workers_c + taken.count)
            building.workers_c = taken.count;
            building.worker_s = salary;
            building.save().then(function () {
              res.send(building);
            });
          });
        });
      } else {
        building.worker_s = salary;
        building.save().then(function () {
          res.send(building);
        });
      }
    });
});

router.get('/dialogs/new', function (req, res, next) {
  if (!req.user) {
    return;
  }
  var user_id = parseInt(req.user.id);
  if (!(user_id > 0)) {
    res.send({});
    return;
  }
  models.messages_news.count({where: {user_id: user_id}}).then(function (news) {
    res.send({count: news});
  });
});

router.get('/dialogs/messages', function (req, res, next) {
  var dialog_id = parseInt(req.query.dialog_id);
  var user_id = parseInt(req.user.id);
  check(models.dialogs, dialog_id, user_id, res)
    .then(function () {
      models.messages.findAll({where: {dialog_id: dialog_id}, include: [{model: models.messages_news, as: 'new', required: false, where: {user_id: user_id}},{model: models.users, attributes: ['username', 'id']}]}).then(function (messages) {
        models.messages_news.destroy({where: {user_id: user_id}, include: {model: models.messages, where: {dialog_id: dialog_id}}});
        models.dialogs_users.update({new: 0}, {where: {dialog_id: dialog_id, $not: {user_id: user_id}}});
        res.send(messages);
      });
    });
});

router.get('/dialogs', function (req, res, next) {
  var user_id = parseInt(req.user.id);
  models.dialogs_users.findAll({
    attributes: [['(SELECT count(*) from messages_news mn where mn.dialog_id=dialogs_users.dialog_id and mn.user_id = ' + user_id + ')', 'new'], 'dialog_id', [sequelize.literal('(SELECT msg FROM messages where messages.dialog_id=dialogs_users.dialog_id order by updatedAt desc limit 1)'), 'last']],
    where: {dialog_id: sequelize.literal("dialogs_users.dialog_id in (SELECT dialog_id FROM dialogs_users WHERE `user_id`='" + user_id + "' order by updatedAt)"), $not: {user_id: user_id}},
    include: [{model: models.users, attributes: ['username', 'id']}]
  })
      .then(function (dialogs) {
        res.send(dialogs);
      });
});

router.post('/dialogs/message/send', function (req, res, next) {
  var send_to = parseInt(req.body.send_to);
  var message = jsesc(req.body.message);
  var user_id = parseInt(req.user.id);
  models.sequelize.query(
      "SELECT fu.* FROM dialogs_users fu INNER JOIN dialogs_users su on fu.dialog_id=su.dialog_id and su.user_id = '" + send_to +
          "' where fu.user_id='" + user_id + "' order by (SELECT COUNT(cu.id) FROM dialogs_users cu WHERE fu.dialog_id=cu.dialog_id) limit 1", { type: sequelize.QueryTypes.SELECT}
  ).then(function (dialog_user) {
        if (dialog_user.length > 0) {
          var new_message = {
            msg: message,
            dialog_id: dialog_user[0].dialog_id,
            user_id: user_id
          };
          models.messages.create(new_message, {attributes: ['id']}, {include: {model: models.users, attributes: ['username']}}).then(function (message) {
            models.messages_news.bulkCreate([
              {message_id: message.id, user_id: send_to, dialog_id: dialog_user[0].dialog_id}
            ]).then(function () {
              res.send(message)
            });
          });
        } else {
          models.dialogs.create({}).then(function (dialog) {
            var new_message = {
              msg: message,
              dialog_id: dialog.id,
              user_id: user_id
            };
            models.dialogs_users.bulkCreate([
              {dialog_id: dialog.id, user_id: user_id, 'new': 0},
              {dialog_id: dialog.id, user_id: send_to, 'new': 0}
            ]).then(function () {
              models.messages.create(new_message, {attributes: ['id']}, {include: {model: models.users, attributes: ['username']}}).then(function (message) {
                models.messages_news.bulkCreate([
                  {message_id: message.id, user_id: send_to, dialog_id: dialog.id}
                ]).then(function () {
                  res.send(message)
                });
              });
            });
          });
        }
  })
});

router.get('/field/buildings', function (req, res, next) {
  var field_id = parseInt(req.query.field_id);
  var mode = parseInt(req.query.mode);
  var page = parseInt(req.query.page) || 0;
  var limit = 10;
  var offset = page * limit;
  var where = {field_id: field_id};
  if (mode > 0) {
    where.mode = mode;
  }
  models.buildings.count({where: where}).then(function (count) {
    models.buildings.findAll({attributes: ['id', 'name', 'mode', 'out_type', 'type'], where: where, offset: offset, limit: limit, include: {model: models.profiles, attributes: ['name'], include: {model: models.users, attributes: ['id', 'username']}}})
        .then(function (buildings) {
          var data = {
            page: page,
            pages: Math.floor(count / limit) + 1,
            buildings: buildings
          };
          res.send(data);
        });
  });

});

function check(model, id, user_id, res) {
  return model.check(id, user_id)
    .then(function (found) {
      if (found) {
        return found;
      } else {
        res.status(403).send('access denied');
        return Promise.reject('access denied');
      }
    })
    .catch(function () {
      res.status(500).send('server error');
      return Promise.reject('server error');
    })
}