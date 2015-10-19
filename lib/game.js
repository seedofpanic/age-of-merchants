var models = require(__dirname + '/models.js')
var schedule = require('node-schedule');
var Game = {
    init: function () {
        schedule.scheduleJob('0 * * * * *', function(){
            Game.update();
        });
    },
    update: function () {
        building_types = models.buildings.types.types;
        building_props = models.buildings.types.params;
        buildings = models.buildings.find({}).each(function (building) {
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
    }
};

module.exports = Game;