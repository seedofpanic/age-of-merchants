var models = require('./../models/index.js');
var schedule = require('node-schedule');
var FIELDS_MAX = 50;
var Game = {
    init: function () {
        /*schedule.scheduleJob('0 * * * *', function(){
            Game.update();
        });*/

        // For debug (I have some problems with async here... Will fix it later)
        setTimeout(function () {
            Game.update();
        }, 1000);
    },
    update: function () {
        building_props = models.buildings.params;
        models.buildings.findAll({include: [{model: models.fields, include: [{model: models.fields_resources, as: 'res'}]}]}).then(function (buildings) {
            buildings.forEach(function (building) {
                switch (building.status)
                {
                    case 0:
                        building.buildtime --;
                        if (building.buildtime < 1)
                        {
                            building.status = 1;
                        }
                        break;
                    case 1:
                        if (building_props[building.type].upkeep > 0) {
                            building.getProfile().then(function (profile){
                                if (profile.gold < building_props[building.type].upkeep) {
                                    return;
                                } else {
                                    profile.gold -= building_props[building.type].upkeep;
                                    profile.save();
                                }
                            });
                        }
                        building_props[building.type]['resources_out'].forEach(function (resource) {
                            if (!building.field) {
                                building.destroy();
                                return;
                            }
                            var count = 0;
                            if (resource.mode == models.buildings.modes.MINE) {
                                type = models.fields_resources.types[resource.type];
                                if (building.field.res[type + '_c'] > resource.count) {
                                    count = resource.count;
                                    building.field.res[type + '_c'] -= resource.count;
                                } else {
                                    count = building.field.res[type + '_c'];
                                    building.field.res[type + '_c'] = 0;
                                }
                                building.addProducts(resource.type, count, building.field.res[type + '_q']);
                            }
                            if (resource.mode == models.buildings.modes.TOWN) {
                                building.addProducts(resource.type, resource.count, 0.01);
                            }
                            if (resource.mode == models.buildings.modes.FACTORY) {
                                for (var Im = 0; Im > resource.need.length; Im++) {
                                    models.findAll({where: {building_id: building.id, protuct_type: resource.need[Im].type}, order: [['count', 'asc']]}).then(
                                        function (products) {
                                            var have_total = 0;
                                            var have_add = 0;
                                            var result_quality = -1;
                                            var need_total = resource.count * resource.need[Im].count;
                                            for (var Ip = 0; Ip < products.length; Ip++) {
                                                if (products[Ip].count < need_total) {
                                                    need_total -= products[Ip].count;
                                                    have_add = products[Ip].count;
                                                    products[Ip].count = 0;
                                                } else {
                                                    products[Ip].count -= need_total;
                                                    have_add = need_total;
                                                }
                                                if (result_quality < 0) {
                                                    result_quality = products[Ip].quality;
                                                } else {
                                                    result_quality = (result_quality * have_total + products[Ip].quality * have_add) / (have_total * have_add);
                                                }
                                                have_total += have_add;
                                                products[Ip].save();
                                                if (need_total == 0) {
                                                    break;
                                                }
                                            }
                                            building.addProducts(resource.type, have_total, result_quality);
                                        }
                                    );
                                }
                            }
                        });
                        break;
                }
                building.save();
            });
        });
        models.contracts.findAll({done: false}).then(function (contracts){
            contracts.forEach(function (contract) {
                switch (contract.type) {
                    case 1:
                        models.products.findById(contract.product_id).then(function (product) {
                            var count;
                            if (product.export_count > contract.count) {
                                count = contract.count;
                                product.export_count -= count;
                            } else {
                                count = product.export_count;
                                product.export_count = 0;
                            }
                            product.take(count, function (taken) {
                                models.buildings.findById(contract.dest_id).then(function (building) {
                                    building.addProducts(product.product_type, taken.count, taken.quality, function () {
                                        contract.done = true;
                                        contract.save()
                                    });
                                });
                            });
                        });
                }
            });
        });
        models.troops.findAll({
            include: [
                {model: models.fields, include: [models.regions]},
                {model: models.troops_moves, as: 'move', include: [{model: models.fields, include: [models.regions]}]}
            ]
        }).then(function (troops) {
            troops.forEach(function (troop) {
                if (troop.move && !atDestenation(troop)) {
                    var move_from = troop.field;
                    var move_to = troop.move.field;
                    var dir;
                    if (move_from.region.id != move_to.region.id) {
                        dir = getDirection(move_from.region.x, move_from.region.y, move_to.region.x, move_to.region.y);
                    } else {
                        dir = getDirection(move_from.x, move_from.y, move_to.x, move_to.y);
                    }
                    var new_x = troop.field.x + dir.x;
                    var new_y = troop.field.y + dir.y;
                    if (new_x >= FIELDS_MAX) {
                        models.regions.find({where: {y: troop.field.region.y, x: troop.field.region.x + 1, $or: {y: troop.field.region.y, x: 0}}})
                            .then(function (region) {
                                switchField(troop, region.id, 0, new_y, function (){
                                    atDestenation(troop);
                                });
                            });
                        return;
                    }
                    if (new_x < 0) {
                        models.regions.find({where: {y: troop.field.region.y, x: troop.field.region.x - 1}})
                            .then(function (region) {
                                switchField(troop, region.id, FIELDS_MAX - 1, new_y, function (){
                                    atDestenation(troop);
                                });
                            });
                        return;
                    }
                    if (new_y >= FIELDS_MAX) {
                        models.regions({where: {y: troop.field.region.y + 1, x: troop.field.region.x, $or: {y: 0, x: troop.field.region.x}}})
                            .then(function (region) {
                                switchField(troop, region.id, new_x, 0, function (){
                                    atDestenation(troop);
                                });
                            });
                        return;
                    }
                    if (new_y < 0) {
                        models.regions({where: {y: troop.field.region.y - 1, x: troop.field.region.x}})
                            .then(function (region) {
                                switchField(troop, region.id, new_x, 49, function (){
                                    atDestenation(troop);
                                });
                            });
                        return;
                    }
                    switchField(troop, troop.field.region.id, new_x, new_y, function (){
                        atDestenation(troop);
                    });
                }
            });
        })
    }
};

function atDestenation(troop) {
    if (troop.move) {
        if (
            troop.field.region_id == troop.move.field.region_id &&
            troop.field.x == troop.move.field.x &&
            troop.field.y == troop.move.field.y
        ) {
            troop.move.destroy();
            return true;
        }
        return false
    }
}
function getDirection(x1, y1, x2, y2) {
    var dir = {x: 0, y: 0};
    var dx = Math.ceil(x2 - x1);
    var dy = Math.ceil(y2 - y1);
    if (dy > dx) {
        dir.y = Math.sign(y2 - y1);
    } else {
        dir.x = Math.sign(x2 - x1);
    }
    return dir;
}
function switchField(troop, region_id, x, y, cb) {
    models.fields.find({where: {region_id: region_id, x: x, y: y}}).then(function (field) {
        troop.setField(field);
        troop.save();
        cb();
    });
}

module.exports = Game;