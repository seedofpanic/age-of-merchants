require('./init');
var models = require('../models/index');
var battle = require('../lib/battle');
exports['test the battle must go on'] = function (assert, done) {

    models.troops_attacks.findAll({
        include: [models.troops]
    }).then(function (attacks) {

        field_ids = [];
        attacks.forEach(function (attack){
            if (field_ids.indexOf(attack.troop.field_id) == -1) {
                field_ids.push(attack.troop.field_id);
            }
        });
        field_ids.forEach(function (field_id) {
            models.troops.findAll({
                where: {
                    field_id: field_id
                }, include: [
                    {model: models.troops_attacks, as: 'attack'}
                ]
            }).then(function (negb_troops) {
                battle(negb_troops, function (){
                    assert.equal(true, true, 'ok');
                    done();
                });
            });
        });
    },function (e) {
        assert.equal(e, true, 'ok');
    });

};

if (module == require.main) require('test').run(exports)
