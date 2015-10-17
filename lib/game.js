var models = require(__dirname + '/models.js')
var schedule = require('node-schedule');
var buildings_types = {
    'types': ['sawmill', 'hunting', 'shop'],
    'names': {'en': {'hunting': 'Hunting hut', 'sawmill': 'Sawmill', 'shop': 'Shop'}},
    'params': {
        'sawmill': {
            'build_time': 1,
            'resources_out': [2]
        },
        'hunting': {
            'build_time': 2,
            'resources_out': [1]
        },
        'shop': {
            'build_time': 3,
            'resources_out': []
        }
    }
};
var Game = {
    init: function () {
        schedule.scheduleJob('0 * * * * *', function(){
            Game.update();
        });
    },
    update: function () {
        building_types = buildings_types.types;
        building_props = buildings_types.params;
        buildings = models.buildings.find({}).each(function (building) {
            switch (building.status)
            {
                case 'building':
                    building.buildtime --;
                    if (building.buildtime < 1)
                    {
                        building.status = 'active';
                    }
                    break;
                case 'active':
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