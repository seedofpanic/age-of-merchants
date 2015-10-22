var models = require(__dirname + '/models.js')
var schedule = require('node-schedule');
var Game = {
    init: function () {
        schedule.scheduleJob('0 * * * *', function(){
            Game.update();
        });

        // For debug (I have some problems with async here... Will fix it later)
        setTimeout(function () {
            Game.update();
        }, 1000);
    },
    update: function () {
        building_props = models.buildings.types.params;
        models.buildings.find({}).each(function (building) {
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
                        building.addGoods(resource, 1, 1);
                    });
                    break;
            }
            building.save();
        });
        models.contracts.find({done: false}).each(function (contract) {
           switch (contract.type) {
               case 1:
                   models.goods.get(contract.goods_id, function (err, goods) {
                       var count;
                       if (goods.export_count > contract.count) {
                           count = contract.count;
                           goods.export_count -= count;
                       } else {
                           count = goods.export_count;
                           goods.export_count = 0;
                       }
                      goods.take(count, function (taken) {
                          models.buildings.get(contract.dest_id, function (err, building) {
                             building.addGoods(goods.product_type, taken.count, taken.quality, function () {
                                 contract.done = true;
                                 contract.save()
                             });
                          });
                      });
                   });
           }
        });
    }
};

module.exports = Game;