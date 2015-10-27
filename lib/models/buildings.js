module.exports = function (db, cb) {
    var props = {
        autoFetchLimit: 2,
        autoFetch: true,
        methods: {
            addGoods: function (product_type, count, quality, cb) {
                var building = this;
                db.models.goods.one({building_id: building.id , product_type : product_type}, function (err, goods) {
                    if (goods) {
                        goods.add(count, quality);
                    } else {
                        new_goods = {
                            building_id: building.id,
                            product_type: product_type
                        };
                        db.models.goods.create(new_goods, function (err, goods) {
                            if (err) {
                                console.log(new_goods);
                                return;
                            }
                            goods.add(count, quality);
                            if (cb) {cb()}
                        });
                        return;
                    }
                    if (cb) {cb()}
                });
            }
        }
    };

    var buildings = db.define('buildings', {
        id: {type: 'serial', key: true},
        name: String,
        field_id: {type: 'integer'},
        profile_id: {type: 'integer'},
        buildtime: {type: 'integer'},
        status: {type: 'integer'},
        type: {type: 'integer'}
    }, props);

    buildings.static = {
        new: function (profile, regoion_id, x, y, type, name, cb) {
            var params = db.models.buildings.types.params[type];
            if (profile.gold < params.price) {
                cb('not_enoth_gold');
                return;
            }
            db.models.fields.one({region_id: regoion_id, x: x, y: y}, function (err, field) {
                if (err) {
                    console.log(err);
                    return;
                }
                var new_building = {
                    profile_id: profile.id,
                    type: type,
                    name: name,
                    field_id: field.id,
                    buildtime: params.build_time,
                    status: 0
                };
                db.models.buildings.create(new_building, function (err, building) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    profile.gold -= params.price;
                    profile.save();
                    cb(null, building);
                });
            });
        }
    };

    buildings.types = {
        'params': {
            0: {//sawmill
                'build_time': 1,
                'resources_out': [{
                    type: 2,
                    count: 100
                }],
                price: 100
            },
            1: {//hunting
                'build_time': 2,
                'resources_out': [{
                    type: 2,
                    count: 10
                }],
                price: 500
            },
            2: {//shop
                'build_time': 3,
                'resources_out': [],
                price: 1000
            }
        }
    };
    return cb();
};