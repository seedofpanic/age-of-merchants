var models = require('./../../models/index.js');

var products = null;
var final_cb = function () {};
var building_props;

function final() {
    setTimeout(final_cb, 0);
}

function buildingsUpdate(cb) {
    final_cb = cb;
    building_props = models.buildings.params;
    models.buildings.findAll({include: [{model: models.fields}]})
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
        final();
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
    var salary_mod = building.workers_s / building.field.avg_salary;
    workers_q_mod = building.workers_q * salary_mod;
    workers_c_mod = building.workers_c / models.buildings.max_workers;
    var count = 0;
    var out_count = workers_c_mod * out.count;
    if (out.mode == models.buildings.modes.MINE) {
        models.fields_resources({where: {field_id: building.field.id, type: out.type}}).then(function (res) {
            if (res.c > out_count) {
                count = out_count;
                res.c -= out_count;
            } else {
                count = res.c;
                res.c = 0;
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
        building.addProducts(out.type, out.count, 0.01, function () {
            building.save().then(function () {
                setTimeout(buildingsIter, 0);
            });
        });
    } else if (out.mode == models.buildings.modes.FACTORY) {
        if (out.need.length == 0) {
            building.save().then(function () {
                setTimeout(buildingsIter, 0);
            });
            return;
        }
        var need_types = [];
        var need_data = {};
        for (need in out.need) {
            need_types[need.type] = need;
        }
        var have_needs = {};
        var have_min = 0;
        models.products.findAll({where: {building_id: building.id, protuct_type: Object.keys(need_types)}, order: [['count', 'asc']]})
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

                var pendings = data.length;
                data.forEach(function (product) {
                    product.save().then(function () {
                       pendings--;
                        if (pendings == 0) {
                            building.addProducts(out.type, have_min, (res.q + workers_q_mod) / 2, function () {
                                building.save().then(function () {
                                    setTimeout(buildingsIter, 0);
                                });
                            });
                        }
                    });
                });
            });

    } else if (out.mode == models.buildings.modes.SHOP) {
        building.save().then(function () {
            setTimeout(buildingsIter, 0);
        });
    } else {
        building.save().then(function () {
            setTimeout(buildingsIter, 0);
        });
    }
}

module.exports = buildingsUpdate;