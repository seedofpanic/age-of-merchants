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

    db.models.buildings_full = db.define('buildings', {
        id: {type: 'serial', key: true},
        name: String,
        field_id: {type: 'integer'},
        profile_id: {type: 'integer'},
        buildtime: {type: 'integer'},
        status: {type: 'integer'},
        type: {type: 'integer'}
    }, props);

    var buildings = db.define('buildings', {
        id: {type: 'serial', key: true},
        name: String,
        field_id: {type: 'integer'},
        profile_id: {type: 'integer'},
        buildtime: {type: 'integer'},
        status: {type: 'integer'},
        type: {type: 'integer'}
    }, props);

    buildings.types = {
        'params': {
            0: {//sawmill
                'build_time': 1,
                'resources_out': [{
                    type: 2,
                    count: 100
                }]
            },
            1: {//hunting
                'build_time': 2,
                'resources_out': [{
                    type: 2,
                    count: 10
                }]
            },
            2: {//shop
                'build_time': 3,
                'resources_out': []
            }
        }
    };
    return cb();
};