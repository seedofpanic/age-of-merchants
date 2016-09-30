var models = require('./../models');
import clearInterval from 'async';

var competitors = {};
var final_cb:() => void = function () {};
var pendings = 0;

function evalBattle(troops, cb: () => void) {
    final_cb = cb;
    console.log('init battle with ' + troops.length + ' troops');
    getSoldiers(troops);
}
function lockTargets() {
    console.log('lock tatgets');
    for (var id in competitors) {
        if (competitors[id].attacks.length == 0) {
            continue;
        }
        competitors[id].attacks.forEach(function (attack) {
            if (attack.target_id == attack.troop_id) {
                attack.destroy();
                return
            }
            if (competitors[attack.target_id]) { // check the existence of the target
                if (competitors[id].targets.indexOf(attack.target_id) == -1) {
                    competitors[id].targets.push(attack.target_id);
                }
                if (competitors[attack.target_id].targets.indexOf(id) == -1) {
                    competitors[attack.target_id].targets.push(id);
                }
            } else {
                attack.destroy();
            }
        });
    }
    for (var id in competitors) {
        if (competitors[id].targets.length == 0) {
            delete competitors[id];
        }
    }
}
var soliders_i = 0;
function getSoldiers(troops) {
    if (soliders_i >= troops.length) {
        console.log('got ' + Object.keys(competitors).length + ' competitors');
        lockTargets();
        startBattle();
        var final_call = setInterval(function () {
            if (pendings == 0) {
                final_cb();
                clearInterval(final_call);
            }
        }, 10);
        return;
    }
    var troop = troops[soliders_i].get();
    var troop_model = troops[soliders_i];
    soliders_i++;
    troop_model.getAttacks().then(function (attacks) {
        models.soldiers.findAll({where: {troop_id: troop.id}}).then(function (soldiers) {
            troop.soldiers = soldiers;
            troop.targets = [];
            troop.attacks = attacks;
            competitors[troop.id] = troop;

            getSoldiers(troops);
        });
    });
}

function calcPower() {
    console.log('calc powers');
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
    console.log('calc results');
    for (var id in competitors) {
        if (!competitors[id] || competitors[id].dead) {
            continue;
        }
        competitors[id].soldiers.forEach(function (soldiers) {
            while (soldiers.power > 0 && Object.keys(competitors[id].targets).length > 0) {
                var target = competitors[
                        competitors[id].targets[
                            Object.keys(competitors[id].targets)[
                                    (Object.keys(competitors[id].targets).length - 1) * Math.random()
                                ]
                        ]
                    ];
                if (target.dead || target.soldiers.length == 0) {
                    competitors[id].targets.splice(competitors[id].targets.indexOf(target), 1);
                    delete competitors[target.id];
                    continue;
                }
                var t_soldiers = target.soldiers[(target.soldiers.length - 1) * Math.random()];
                console.log(soldiers.id + '(' + soldiers.count + ')' + ' hits ' + t_soldiers.id + '(' + t_soldiers.count + ')' + ' for ' + soldiers.power)
                if (t_soldiers.life > soldiers.power) {
                    t_soldiers.life -= soldiers.power;
                    t_soldiers.count = Math.ceil(t_soldiers.life / (models.soldiers.stats[t_soldiers.product_type].life * t_soldiers.quality));
                    soldiers.power = 0;
                } else {
                    soldiers.power -= t_soldiers.life;
                    t_soldiers.life = 0;
                    target.soldiers.splice(target.soldiers.indexOf(t_soldiers), 1);
                    pendings++;
                    t_soldiers.destroy().done(function () {
                        pendings--;
                    });
                    if (target.soldiers.length == 0) {
                        target.dead = true;
                        delete competitors[target.id];
                        competitors[id].targets.splice(competitors[id].targets.indexOf(target), 1);
                        pendings++;
                        models.troops_attacks.destroy({where: {$or: [{troop_id: target.id}, {target_id: target.id}]}}).done(function () {
                            models.troops_moves.destroy({where: {troop_id: target.id}}).done(function () {
                                models.soldiers.destroy({where: {troop_id: target.id}}).done(function () {
                                    models.troops.destroy({where: {id: target.id}}).done(function () {
                                        pendings--;
                                    });
                                });
                            });
                        });
                    }
                }
            }
        });
    }
}

function saveSurvivers() {
    for (var id in competitors) {
        competitors[id].soldiers.forEach(function (soldiers) {
            pendings++;
            soldiers.save().done(function () {
                pendings--;
            });
        });
    }
}

function startBattle() {
    console.log('starting battle');
    while (Object.keys(competitors).length > 1) {
        calcPower();
        calcResults();
    }
    saveSurvivers();

}



module.exports = evalBattle;