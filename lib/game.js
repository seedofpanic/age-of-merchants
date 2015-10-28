var models = require('./../models/index.js');
var schedule = require('node-schedule');
var Game = {
    init: function () {
        schedule.scheduleJob('0 * * * *', function(){
            Game.update();
        });

        // For debug (I have some problems with async here... Will fix it later)
        /*setTimeout(function () {
            Game.update();
        }, 1000);*/
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
                        building_props[building.type]['resources_out'].forEach(function (resource) {
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
                                building.addProducts(resource.type, resource.count, 1);
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
    }
};

module.exports = Game;