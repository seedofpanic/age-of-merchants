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
    models.buildings.findAll({include: [{model: models.fields, include: [{model: models.fields_resources, as: 'res'}]}]})
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
    }
}

function updateBuildingModeWrap() {
    if (!building.field) {
        building.destroy().then(updateBuildingMode);
        return;
    }
    updateBuildingMode();
}

function updateBuildingMode() {
    var out = building_props[building.type]['resources_out'][building.out_type || 0];
    if (!out) {
        setTimeout(buildingsIter, 0);
        return;
    }
    var count = 0;
    if (out.mode == models.buildings.modes.MINE) {
        type = models.fields_resources.types[out.type];
        if (building.field.res[type + '_c'] > out.count) {
            count = out.count;
            building.field.res[type + '_c'] -= out.count;
        } else {
            count = building.field.res[type + '_c'];
            building.field.res[type + '_c'] = 0;
        }
        building.addProducts(out.type, count, building.field.res[type + '_q'], function () {
            building.save().then(function () {
                setTimeout(buildingsIter, 0);
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
        for (var Im = 0; Im > out.need.length; Im++) {
            models.products.findAll({where: {building_id: building.id, protuct_type: out.need[Im].type}, order: [['count', 'asc']]})
                .then(function (data) {
                    productsWrapper(data, function() {
                        building.save().then(function () {
                            setTimeout(buildingsIter, 0);
                        });
                    })
                });
        }
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

var have_total;
var have_add;
var result_quality;
var need_total;
var Ip;

function productsWrapper(data, cb) {
    if (!data) {
        cb();
        return;
    }
    products = data;
    Ip = products.length - 1;
    have_total = 0;
    have_add = 0;
    result_quality = -1;
    need_total = resource.count * resource.need[Im].count;
    setTimeout(productsIter);
}

function productsIter() {
    if (Ip == -1) {
        buildingsIter();
        return;
    }
    var product = products[Ip];
    Ip--;
    if (product.count < need_total) {
        need_total -= product.count;
        have_add = product.count;
        product.count = 0;
    } else {
        product.count -= need_total;
        have_add = need_total;
    }
    if (result_quality < 0) {
        result_quality = product.quality;
    } else {
        result_quality = (result_quality * have_total + product.quality * have_add) / (have_total * have_add);
    }
    have_total += have_add;
    product.save().then(function () {
        if (need_total == 0) {
            setTimeout(productsIter, 0);
            return;
        }
        building.addProducts(resource.type, have_total, result_quality, function () {
            setTimeout(productsIter, 0);
        });
    });
}

module.exports = buildingsUpdate;