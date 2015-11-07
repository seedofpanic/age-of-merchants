var models = require('./../models/index.js');

var competitors = {};
function evalBattle(troops) {


    getSoldiers();
}
function lockTargets() {
    for (var id in competitors) {
        if (typeof competitors[id].targets === 'undefined') {
            competitors[id].targets = [];
        }
        competitors[id].targets.push(competitors.attack.target_id);
        competitors[competitors.attack.target_id] = id;
    }
}
var soliders_i = 0;
function getSoldiers() {
    if (soliders_i >= troops.length) {
        lockTargets();
        return;
    }
    var troop = troops[soliders_i].get();
    soliders_i++;
    if (!troop.attack) {return;}
    troop.getSoldiers().then(function (soldiers){

        troop.soldiers = soldiers;
        competitors[troop.id] = troop;

        getSoldiers();
    });
}

function calcPower() {
    for (var id in competitors) {
        competitors[id].soldiers.forEach(function (soldiers){
            var stats = models.soldiers.stats[soldiers.product_type];
            soldiers.power = [];
            var min_pow = stats.power[0] * soldiers.count * soldiers.quality;
            var max_pow = stats.power[1] * soldiers.count * soldiers.quality;
            soldiers.power = min_pow + Math.random() * (max_pow - min_pow);
            soldiers.life = stats.life * soldiers.count * soldiers.quality;
        });
    }
}

function calcResults() {
    for (var id in competitors) {
        if (competitors[id].dead) {
            continue;
        }
        competitors[id].soldiers.forEach(function (soldiers) {
            while (soldiers.power > 0 && Object.keys(competitors[id].targets).length > 0) {
                var target = competitors[id].targets[
                        Object.keys(competitors[id].targets)[
                                parseInt((Object.keys(competitors[id].targets).length - 1) * Math.random())
                            ]
                    ];
                if (target.dead) {
                    competitors[id].targets.splice(competitors[id].targets.indexOf(target), 1);
                    continue;
                }
                var t_soldiers = target.soldiers[parseInt((target.soldiers.length - 1) * Math.random())];
                if (t_soldiers.life > soldiers.power) {
                    t_soldiers.life -= soldiers.power;
                    t_soldiers.count = Math.ceil(t_soldiers.life / (models.soldiers.stats[t_soldiers.product_type].life * t_soldiers.quality));
                    soldiers.power = 0;
                } else {
                    soldiers.power -= t_soldiers.life;
                    t_soldiers.life = 0;
                    target.soldiers.splice(target.soldiers.indexOf(t_soldiers), 1);
                    target.destroy(); // async unsafe
                    if (target.soldiers.length == 0) {
                        target.dead = true;
                        competitors[id].targets.splice(competitors[id].targets.indexOf(target), 1);
                        models.troops.destroy({where: {id: target.id}}); // async unsafe
                    }
                }
                t_soldiers.save();
            }
        });
    }
}

function saveSurvivers() {
    for (var id in competitors) {
        competitors[id].soldiers.forEach(function (soldiers) {
            soldiers.save();
        });
    }
}

function startBattle() {
    while (competitors.length > 1) {
        calcPower();
        calcResults();
    }
    saveSurvivers();
}



module.exports = evalBattle;