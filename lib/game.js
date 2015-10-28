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
                            type = models.fields_resources.types[resource.type];
                            if (building.field.res[type + '_c'] > resource.count) {
                                count = resource.count;
                                building.field.res[type + '_c'] -= resource.count;
                            } else {
                                count = building.field.res[type + '_c'];
                                building.field.res[type + '_c'] = 0;
                            }
                            building.addProducts(resource.type, count, building.field.res[type + '_q']);
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