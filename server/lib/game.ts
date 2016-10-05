var models = require('./../models');
var schedule = require('node-schedule');
import buildingsUpdate from './game/buildings';
var contractsUpdate = require('./game/contracts');
var troopsUpdate = require('./game/troops');
var env = process.env.NODE_ENV || 'development';
var config = require('./../config/game.json')[env];

var Game = {
    updating: false,
    init: function () {
        schedule.scheduleJob(config.schedule_job, function(){
            // Game.update();
        });
        // For debug (I have some problems with async here... Will fix it later)
        if (config.update_on_start) {
            setTimeout(function () {
                // Game.update();
            }, 1000);
        }
    },
    update: function () {
        Game.updating = true;
        var contracts = 0;
        var troops = 0;
        var final = 0;
        console.log('update buildings');
        buildingsUpdate(function () {
            if (contracts > 0) {
                throw('contracts called more then one time!');
            }
            contracts ++;
            console.log('update contracts');
            contractsUpdate(function () {
                if (troops > 0) {
                    throw('troops called more then one time!');
                }
                troops ++;
                console.log('update troops');
                troopsUpdate(function () {
                    if (final > 0) {
                        throw('final called more then one time!');
                    }
                    final ++;
                    console.log('update done!');
                    Game.updating = false;
                })
            });
        });
    }
};



module.exports = Game;