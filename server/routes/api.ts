import {BUILDING_PARAMS, BuildingModel, Building} from "../models/buildings";
import {UserModel} from "../models/users";
import {Profile, ProfileModel} from "../models/profiles";
import {RegionModel} from "../models/regions";
import {ProductModel, Product} from "../models/products";
import {TroopModel, Troop} from "../models/troops";
import {Field, FieldModel} from "../models/fields";
import {TroopMoveModel, TroopMove} from "../models/troops_moves";
import {ContractModel} from "../models/contracts";
import {SoldierModel} from "../models/soldiers";
import {TroopAttackModel} from "../models/troops_attacks";
import {MessageModel, Message} from "../models/messages";
import {DialogModel} from "../models/dialogs";
const express = require('express');
const router = express.Router();
const jsesc = require('escape-html');

router.get('/profile', function(req, res, next) {
  if (!req.user) {
    return;
  }
  check(ProfileModel, req.query.id, req.user._id, res)
      .then(function (profile) {
        res.send(profile);
      });
});

router.get('/user', function (req, res, next) {
  if (req.user) {
    res.send({id: req.user._id});
  } else {
    res.send({});
  }
});

router.get('/user/profile', function (req, res, next) {
  ProfileModel.find({'user._id': req.user.id}, '_id username email createdAt').exec().then((profiles: Profile[]) => {
    res.send(profiles);
  })
});

router.get('/buildings/types', function(req, res, next) {
  res.send(BUILDING_PARAMS);
});

router.get('/buildings', function(req, res, next) {
  ProfileModel.findById({id: req.query.profile_id}).then(function (profile: Profile) {
    BuildingModel.find({'profile._id': profile._id}).populate('fields').then(function (buildings){
      res.send(buildings);
    })
  });
});

router.get('/users', function(req, res, next) {
  const limit = 10;
  const page = parseInt(req.query.page);
  const offset = ((page > -1) ? page : 0) * limit;
  UserModel.count({}).then(function (result: number){
    UserModel.find({}, {id: true, username: true}, {offset: offset, limit: limit}).then(function (users){
      const data = {
        page: page,
        users: users,
        pages: Math.floor(result / limit) + 1
      };
      res.send(data);
    });
  });
});

router.get('/troops', function(req, res, next) {
  ProfileModel.findOne({'_id': req.query.profile_id}).then(function (profile: Profile) {
    if (!profile) {
      res.status(500).send();
      return;
    }
    check(ProfileModel, profile._id, req.user._id, res)
      .then(function () {
        // attributes: ['id', ['(SELECT count(*) FROM `troops` as t WHERE t.`field_id`=`troops`.`field_id` and t.id != `troops`.`id`)', 'neighbors']],
        return TroopModel.find({
          'profile._id': profile._id
        }).populate({path: 'field', populate: {path: 'troop_moves'}}).exec().then(function (troops) {
          res.send(troops);
        })
      });
  });
});

router.get('/troops/field', function(req, res, next) {
  const troop_id: string = req.query.troop_id;
  const field_id: string = req.query.field_id;
  check(TroopModel, troop_id, req.user._id, res)
    .then(function (troop) {
      TroopModel.find({
        'field._id': troop.field_id, $not: {id: troop._id}
      }).populate('assault').populate('profile').exec().then((troops: Troop[]) => {
        res.send(troops);
      })
    });
});

router.post('/troop/move', function(req, res, next) {
  check(TroopModel, req.body.id, req.user.id, res)
    .then(function (troop) {
      FieldModel.findOne({'region._id': troop.move.field.region._id, x: troop.move.field.x, y: troop.move.field.y}).exec()
      .then(function (field: Field) {
        const new_move = {
          troop_id: troop._id,
          field_id: field._id
        };
        TroopMoveModel.create(new_move).then(function (move: TroopMove) {
          res.send(troop.move.field);
        });
      })
  });
});
router.post('/troop/stop', function(req, res, next) {
  check(TroopModel, req.body.troop_id, req.user.id, res)
    .then(function (troop) {
      TroopMoveModel.remove({'troop._id': troop._id}).then(function () {
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
  const x = parseInt(req.body.x);
  const y = parseInt(req.body.y);
  const type = parseInt(req.body.type);
  const out_type = parseInt(req.body.out_type);
  const out_props = BUILDING_PARAMS[type].resources_out[out_type];
  if (!out_props) {
    res.status(500).send();
    return;
  }
  check(ProfileModel, req.body.profile_id, req.user.id, res)
    .then(function (profile: Profile) {
      const new_building = {
        profile: profile,
        region_id: parseInt(req.body.region),
        x: checkFieldCoord(x),
        y: checkFieldCoord(y),
        type: type,
        name: jsesc(req.body.name),
        out_type: out_type,
        mode: out_props.mode
      };
      BuildingModel.create(new_building)
        .then((building) => {
          BuildingModel.populate(building, {path: 'field'}).then(function (building) {
            res.send(building);
          });
        })
          .catch((err) => res.status(500).send(err));
    });
});

router.get('/profiles', function(req, res, next){
  ProfileModel.find({'user._id': req.user._id}).exec().then(function (profiles: Profile[]) {
    res.send(profiles);
  });
});

router.post('/profile/new', function(req, res, next){
  const new_profile = {
    user: req.user,
    name: jsesc(req.body.name),
    gold: 1000
  };
  ProfileModel.find({name: new_profile.name}).exec().then(function (profile) {
    if (!profile.length) {
      ProfileModel.create(new_profile).then(function (profile) {
        res.send(profile);
      });
    } else {
      res.status(500).send('Account with such name already exists!');
    }
  })
});

router.get('/regions', function(req, res, next){
  RegionModel.find().exec().then(function (regions) {
    res.send(regions);
  });
});

router.get('/products/humans', function(req, res, next){
  check(BuildingModel, req.query.building_id, req.user.id, res)
    .then(function () {
      ProductModel.find({
        'building._id': req.query.building_id, product_type: 3
      }, 'id count quality').then(function (result) {
        res.send(result);
      });
    });
});

router.get('/products', function(req, res, next){
  check(BuildingModel, req.query.building_id, req.user.id, res)
    .then(function () {
      ProductModel.find({'building._id': req.query.building_id}).then(function (products) {
        res.send(products);
      });
    });
});

router.get('/products/import', function(req, res, next){
  ProductModel.find({'export': true}).then(function (products) {
    res.send(products);
  });
});

router.get('/products/import/my', function(req, res, next){
  ProductModel.find({'buildings.profie.user._id': req.user.id})
      .populate({path: 'buildings', populate: {path: 'profile', populate: {path: 'user'}}})
      .exec()
      .then(function (products) {
        res.send(products);
      });
});

router.get('/army', function(req, res, next){
  check(BuildingModel, req.query.building_id, req.user.id, res)
    .then(function () {
      ProductModel.find({building_id: req.query.building_id, is_army: true})
        .exec()
        .then(function (products) {
          res.send(products);
        });
    });
});

router.post('/product/start_export', function(req, res, next){
  const product_id: string = req.body.id;
  check(ProductModel, product_id, req.user.id, res)
    .then(function () {
      ProductModel.findOne(product_id).exec().then(function (product: Product) {
        product.export = req.body.export ? true : false;
        product.export_count = parseInt(req.body.export_count);
        product.price = parseFloat(req.body.price).toFixed(2);
        product.save();
        res.send(product);
      });
    });
});

router.post('/product/stop_export', function(req, res, next){
  const product_id: string = req.body.id;
  check(ProductModel, product_id, req.user.id, res)
    .then(function () {
      ProductModel.findById(product_id).exec().then(function (product: Product) {
        product.export = false;
        product.save();
        res.send(product);
      });
    });
});

router.post('/contracts/new', function(req, res, next){
  const new_contract = {
    product_id: req.body.product.id,
    dest_id: parseInt(req.body.building_id),
    count: parseInt(req.body.count),
    type: parseInt(req.body.type)
  };
  check(ProductModel, new_contract.product_id, req.user.id, res)
    .then(function () {
      newContract(new_contract, res);
    })
    .catch(function () {
      ProductModel.find({_id: new_contract.product_id, 'export': true}).then(function (product) {
        if (!product) {
          res.status(500).send();
          return;
        }
        newContract(new_contract, res);
      });
    });
});

function newContract(new_contract, res) {
  ContractModel.create(new_contract).then(function (contract) {
    res.send(contract);
  });
}

router.post('/troops/new', function(req, res, next){
  check(ProfileModel, req.body.profile_id, req.user.id, res)
    .then(function (profile) {
      const building_id = parseInt(req.body.building_id);
      BuildingModel.findOne({_id: building_id, 'profile._id': profile._id}).exec().then(function (building: Building) {
        if (!building) {
          res.status(500).send();
          return;
        }
        const new_troop = {
          profile_id: profile.id,
          field_id: building.field._id
        };
        TroopModel.create(new_troop).then(function (troop) {
          const soldiers = req.body.soldiers;
          soldiers.forEach(function (soldier) {
            ProductModel.findById(soldier.id).exec().then(function (product: Product) {
              soldier.recruit = (soldier.recruit > product.count) ? product.count : soldier.recruit;
              product.count -= soldier.recruit;
              product.save();
              const new_soldier = {
                troop_id: troop._id,
                product_type: product.product_type,
                count: soldier.recruit,
                quality: product.quality
              };
              SoldierModel.create(new_soldier);
            });
          });
          res.send(troop);
        });
      });
    });
});


router.get('/map', function (req, res, next) {
  const map = [];
  const type = parseInt(req.query.type);
  const sub_type = parseInt(req.query.sub_type);
  if (type == 0) {
    return;
  }
  if (type == 1) {
    FieldModel.find({
      region_id: req.query.region_id,
      'field_resource.type': sub_type
    }).populate('field_resource').exec()
        .then(function (fields: Field[]) {
      for (let i = 0; i < fields.length; i++) {
        if (!map[fields[i].x]) {
          map[fields[i].x] = [];
        }
        map[fields[i].x][fields[i].y] = fields[i];
      }
      res.send(map);
    });
  } else if (type == 2) {
    let and = '';
    if (sub_type != -2) {
      and = ' and mode=' + sub_type;
    }
    // attributes: ['x', 'y', 'id', 'avg_salary',['(SELECT COUNT(*) FROM buildings where field_id=fields.id' + and + ')', 'c']]
    FieldModel.find({
      'region._id': req.query.region_id
    }).exec().then(function (fields: Field[]) {
      for (let i = 0; i < fields.length; i++) {
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
  const troop_id: string = req.body.troop_id;
  const target_id: string = req.body.target_id;
  check(TroopModel, troop_id, req.user.id, res)
    .then(function (troop: Troop) {
      TroopAttackModel.find({
        'troop._id': troop._id, 'target._id': target_id
      }).then(function () {
        res.send('ok');
      }).catch(() => {
        TroopModel.findById(target_id).exec().then((target: Troop) => {
          TroopAttackModel.create({'troop': troop, 'target': target});
        });
      });
    });
});

router.post('/troops/stop_attack', function (req, res, next) {
  const troop_id: string = req.body.troop_id;
  const target_id: string = req.body.target_id;
  check(TroopModel, troop_id, req.user.id, res)
    .then(function (troop) {
      TroopAttackModel.remove({'troop._id': troop.id, 'target._id': target_id}).exec().then(() => {
        res.send('ok');
      });
    });
});

router.post('/buildings/employ', function (req, res, next) {
  const id: string = req.body.id;
  const count: number = parseInt(req.body.count);
  const salary: string = parseFloat(req.body.salary).toFixed(2);
  const building_id: string = req.body.building_id;
  check(BuildingModel, building_id, req.user.id, res)
    .then(function (building) {
      if (id) {
        ProductModel.findOne({_id: id, 'building._id': building_id}).exec().then(function (product: Product) {
          product.take(count).then((taken) => {
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
  const user_id = req.user._id;
  if (!(user_id > 0)) {
    res.send({});
    return;
  }
  MessageModel.count({}).exec().then(function (count) {
    res.send({count: count});
  });
});

router.get('/dialogs/messages', function (req, res, next) {
  const dialog_id: string = req.query.dialog_id;
  const user_id: string = req.user.id;
  check(DialogModel, dialog_id, user_id, res)
    .then(function () {
      MessageModel.find({'dialog._id': dialog_id, 'user._id': user_id}).exec().then(function (messages: Message[]) {
        res.send(messages);
      });
    });
});

router.get('/dialogs', function (req, res, next) {
  const user_id = parseInt(req.user.id);
  DialogModel.find({
    'users._id': user_id
  })
      .then(function (dialogs) {
        res.send(dialogs);
      });
});

router.post('/dialogs/message/send', function (req, res, next) {
  const send_to = parseInt(req.body.send_to);
  const message = jsesc(req.body.message);
  const user_id = parseInt(req.user.id);

  // TODO: message sending code goes here =o)
});

router.get('/field/buildings', function (req, res, next) {
  const field_id: string = req.query.field_id;
  const mode: number = parseInt(req.query.mode);
  const page: number = parseInt(req.query.page) || 0;
  const limit: number = 10;
  const offset: number = page * limit;
  const where = {field_id: field_id, mode: {}};
  if (mode > 0) {
    where.mode = mode;
  }
  BuildingModel.count(where).exec().then(function (count) {
    BuildingModel.find(where, ['id', 'name', 'mode', 'out_type', 'type'], {offset: offset, limit: limit}).exec()
        .then(function (buildings) {
          const data = {
            page: page,
            pages: Math.floor(count / limit) + 1,
            buildings: buildings
          };
          res.send(data);
        });
  });

});

function check(model, id: string, user_id: string, res) {
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