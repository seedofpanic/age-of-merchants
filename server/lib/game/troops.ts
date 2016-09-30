var models = require('./../../models');
var battle = require('./../battle');
var FIELDS_MAX = 50;
var final_cb;

function troopsUpdate(cb) {
    final_cb = cb;

    models.troops_attacks.findAll({
        include: [models.troops]
    }).then(function (attacks) {
        if (attacks.length == 0) {
            final_cb();
            return;
        }
        const field_ids = [];
        attacks.forEach(function (attack){
            if (field_ids.indexOf(attack.troop.field_id) == -1) {
                field_ids.push(attack.troop.field_id);
            }
        });
        field_ids.forEach(function (field_id) {
            models.troops.findAll({
                where: {
                    field_id: field_id
                }
            }).then(function (negb_troops) {
                if (negb_troops.length == 0) {
                    final_cb();
                    return;
                }
                battle(negb_troops, function () {

                    models.troops.findAll({
                        include: [
                            {model: models.fields, include: [models.regions]},
                            {model: models.troops_moves, as: 'move', include: [{model: models.fields, include: [models.regions]}]}
                        ]
                    }).then(function (troops) {
                        if (troops.length > 0) {
                            troopsWrapper(troops);
                        } else {
                            final_cb();
                        }
                    })

                });
            });
        });
    });
}

var troops;
var troop;
var It;

function troopsWrapper(data) {
    troops = data;
    It = troops.length - 1;
    troopsIter();
}

function troopsIter() {
    if (It == -1) {
        final_cb();
        return;
    }
    const troop = troops[It];
    It--;
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
                        atDestenation(troop).then(function () {
                            troopsIter();
                        });
                    });
                });
            return;
        }
        if (new_x < 0) {
            models.regions.find({where: {y: troop.field.region.y, x: troop.field.region.x - 1}})
                .then(function (region) {
                    switchField(troop, region.id, FIELDS_MAX - 1, new_y, function (){
                        atDestenation(troop).then(function () {
                            troopsIter();
                        });
                    });
                });
            return;
        }
        if (new_y >= FIELDS_MAX) {
            models.regions({where: {y: troop.field.region.y + 1, x: troop.field.region.x, $or: {y: 0, x: troop.field.region.x}}})
                .then(function (region) {
                    switchField(troop, region.id, new_x, 0, function (){
                        atDestenation(troop).then(function () {
                            troopsIter();
                        });
                    });
                });
            return;
        }
        if (new_y < 0) {
            models.regions({where: {y: troop.field.region.y - 1, x: troop.field.region.x}})
                .then(function (region) {
                    switchField(troop, region.id, new_x, 49, function (){
                        atDestenation(troop).then(function () {
                            troopsIter();
                        });
                    });
                });
            return;
        }
        switchField(troop, troop.field.region.id, new_x, new_y, function (){
            atDestenation(troop).then(function () {
                troopsIter();
            });
        });
    }
}


function atDestenation(troop): Promise<any> {
    if (troop.move) {
        if (
            troop.field.region_id == troop.move.field.region_id &&
            troop.field.x == troop.move.field.x &&
            troop.field.y == troop.move.field.y
        ) {
            return troop.move.destroy();
        }
        return Promise.resolve();
    }
}
function getDirection(x1, y1, x2, y2) {
    var dir = {x: 0, y: 0};
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
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
        troop.save().then(function () {
            if (cb) { cb() };
        });
    });
}

module.exports = troopsUpdate;