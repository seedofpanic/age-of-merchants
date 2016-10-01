import {BUILDINGS_STATUSES} from "../../models/buildings";
var sequelize = require('sequelize');
var models = require('./../../models');

var products = null;
var final_cb = function () {};
var building_props;

function final() {
    setTimeout(final_cb, 0);
}

export default function buildingsUpdate(cb) {
    final_cb = cb;
    building_props = models.buildings.params;
    models.buildings.findAll({include: [{model: models.fields}, {model: models.profiles}]})
        .then(buildingsWrapper);
}

var buildings;
var Ib;
var building;

function buildingsWrapper(data) {
    buildings = data;
    Ib = buildings.length - 1;
    buildingsIter();
}

function buildingsIter() {
    if (Ib == -1) {
        models.fields.update({avg_salary: sequelize.literal('(SELECT SUM(worker_s)/COUNT(worker_s) FROM buildings WHERE field_id=fields.id and worker_s > 0 and workers_c > 0)' )}, {where: {}})
            .then(function () {
                models.products.destroy({where: {count: 0}}).then(function () {
                    final();
                });
            });
        return;
    }
    building = buildings[Ib];
    Ib--;
    switch (building.status)
    {
        case 0:
            building.buildtime --;
            if (building.buildtime < 1)
            {
                building.status = 1;
            }
            building.save().then(function () {
                buildingsIter();
            });
            break;
        case 1:
        case 2:
            if (building_props[building.type].upkeep > 0) {
                building.getProfile().then(function (profile){
                    if (profile.gold < building_props[building.type].upkeep) {
                        buildingsIter();
                        return;
                    } else {
                        profile.gold -= building_props[building.type].upkeep;
                        profile.save().then(function () {
                            updateBuildingModeWrap();
                        });
                        return;
                    }
                });
                return;
            }
            updateBuildingModeWrap();
            break;
        default:
            buildingsIter();
    }
}

function updateBuildingModeWrap() {
    if (!building.field) {
        building.destroy().then(updateBuildingMode);
        return;
    }
    updateBuildingMode();
}

var workers_q_mod;
var workers_c_mod;

function updateBuildingMode() {
    var out = building_props[building.type]['resources_out'][building.out_type || 0];
    if (!out) {
        setTimeout(buildingsIter, 0);
        return;
    }
    building.worker_s = building.worker_s || 0;
    building.workers_c = building.workers_c || 0;
    building.workers_q = building.workers_q || 0;
    var to_pay = building.worker_s * building.workers_c;
    if (building.profile.gold < to_pay) {
        building.status = BUILDINGS_STATUSES.CANT_PAY;
        building.save().then(function () {
            setTimeout(buildingsIter, 0);
        });
        return;
    }
    building.profile.gold -= to_pay;
    building.profile.save().then(function () {


        var salary_mod = building.worker_s / building.field.avg_salary;
        workers_q_mod = building.workers_q * salary_mod;
        workers_c_mod = building.workers_c / building_props[building.type].max_workers;

        var count = 0;
        var out_count = workers_c_mod * out.count;
        if (out.mode == models.buildings.modes.MINE) {
            //console.log('mine update');
            models.fields_resources.find({where: {field_id: building.field.id, type: out.type}}).then(function (res) {
                if (res.c > out_count) {
                    count = out_count;
                    res.c -= out_count;
                } else {
                    count = res.c;
                    res.c = 0;
                }
                if (count == 0) {
                    building.save().then(function () {
                        setTimeout(buildingsIter, 0);
                    });
                    return;
                }
                res.save().then(function () {
                    building.addProducts(out.type, count, (res.q + workers_q_mod) / 2, function () {
                        building.save().then(function () {
                            setTimeout(buildingsIter, 0);
                        });
                    });
                });
            });
        } else if (out.mode == models.buildings.modes.TOWN) {
            //console.log('town update');
            building.addProducts(out.type, out.count, 0.01, function () {
                building.save().then(function () {
                    setTimeout(buildingsIter, 0);
                });
            });
        } else if (out.mode == models.buildings.modes.FACTORY) {
            //console.log('factory update');
            if (out.need.length == 0) {
                building.save().then(function () {
                    setTimeout(buildingsIter, 0);
                });
                return;
            }
            var need_types = [];
            out.need.forEach(function (need) {
                need_types[need.type] = need;
            });
            var have_needs = {};
            var have_min = 0;
            models.products.findAll({
                where: {building_id: building.id, product_type: Object.keys(need_types)},
                order: [['count', 'asc']]
            })
                .then(function (data) {

                    data.forEach(function (product) {
                        if (!have_needs[product.product_type]) {
                            have_needs[product.product_type] = {count: 0};
                        }
                        var still_need = out_count - have_needs[product.product_type].count;
                        if (still_need == 0) {
                            return;
                        } else if (still_need < 0) {
                            throw 'still_need is less then 0 error!';
                        }
                        if (product.count / need_types[product.protuct_type].count < still_need) {
                            have_needs[product.product_type].count += product.count / need_types[product.protuct_type].count;
                        } else {
                            have_needs[product.product_type].count += still_need;
                        }
                    });

                    var keys = Object.keys(have_needs);
                    for (var i = 1; i < keys.length; i++) {
                        if (have_needs[keys[i]].count < have_min) {
                            have_min = have_needs[keys[i]].count;
                        }
                    }

                    var takens = {};

                    data.forEach(function (product) {
                        if (!takens[product.product_type]) {
                            takens[product.product_type] = {count: 0};
                        }
                        var still_need = have_min * need_types[product.protuct_type].count - takens[product.product_type].count;
                        if (still_need == 0) {
                            return;
                        } else if (still_need < 0) {
                            throw 'still_need is less then 0 error!';
                        }
                        if (product.count < still_need) {
                            takens[product.product_type].quality =
                                (takens[product.product_type].count * takens[product.product_type].quality + product.count * product.quality)
                                / takens[product.product_type].count * product.count;
                            takens[product.product_type].count += product.count;
                            product.count = 0;
                        } else {
                            takens[product.product_type].quality =
                                (takens[product.product_type].count * takens[product.product_type].quality + still_need * product.quality)
                                / takens[product.product_type].count * still_need;
                            takens[product.product_type].count += still_need;
                            product.count -= still_need;
                        }
                    });

                    if (data.length == 0) {
                        building.save().then(function () {
                            setTimeout(buildingsIter, 0);
                        });
                        return;
                    }
                    var pendings = data.length;
                    data.forEach(function (product) {
                        product.save().then(function () {
                            pendings--;
                            if (pendings == 0) {
                                // TODO: product.q is not quiet right...
                                building.addProducts(out.type, have_min, (product.q + workers_q_mod) / 2, function () {
                                    building.save().then(function () {
                                        setTimeout(buildingsIter, 0);
                                    });
                                });
                            }
                        });
                    });
                });

        } else if (out.mode == models.buildings.modes.SHOP) {
            //console.log('shop update');
            building.save().then(function () {
                setTimeout(buildingsIter, 0);
            });
        } else if (out.mode == models.buildings.modes.GOLDMINE) {
            //console.log('gold mine update');
            models.fields_resources.find({where: {field_id: building.field.id, type: out.type}}).then(function (res) {
                if (res.c > out.count) {
                    count = out.count;
                    res.c -= out.count;
                } else {
                    count = res.c;
                    res.c = 0;
                }
                res.save().then(function () {
                    building.profile.gold += count;
                    building.profile.save().then(function () {
                        building.save().then(function () {
                            setTimeout(buildingsIter, 0);
                        });
                    });
                });
            });
        } else {
            //console.log('unknown update');
            building.save().then(function () {
                setTimeout(buildingsIter, 0);
            });
        }
    });
}