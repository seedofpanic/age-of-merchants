var passwordHash = require('password-hash');
module.exports = {
    __init: function (db, models, next) {
        module.exports.users = models.users = db.define("users", {
            id: {type: 'serial', key: true},
            email: String,
            username: String,
            password: String,
            logins: {type: 'integer', defaultValue: 0},
            last_login: {type: 'integer', defaultValue: 0}
        }, {
            methods: {
                validPassword: function (password) {
                    return passwordHash.verify(password, this.password);
                },
                setPassword: function (password) {
                    this.password = passwordHash.generate(password);
                    this.save();
                }
            }
        });
        module.exports.profiles = models.profiles = db.define("profiles", {
            id: {type: 'serial', key: true},
            user_id: {type: 'integer'},
            name: String,
            gold: {type: 'integer', defaultValue: 0}
        }, {
            methods: {

            }
        });
        module.exports.buildings = models.buildings = db.define('buildings', {
            id: {type: 'serial', key: true},
            name: String,
            field_id: {type: 'integer'},
            profile_id: {type: 'integer'},
            buildtime: {type: 'integer'},
            status: {type: 'integer'},
            type: {type: 'integer'}
        }, {
            autoFetchLimit: 2,
            autoFetch: true,
            methods: {
                addGoods: function (product_type, count, quality, cb) {
                    var building = this;
                    models.goods.one({building_id: building.id , product_type : product_type}, function (err, goods) {
                        if (goods) {
                            goods.add(count, quality);
                        } else {
                            new_goods = {
                                    building_id: building.id,
                                    product_type: product_type
                                };
                            models.goods.create(new_goods, function (err, goods) {
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
        });
        models.buildings.types = {
            'params': {
                0: {//sawmill
                    'build_time': 1,
                    'resources_out': [2]
                },
                1: {//hunting
                    'build_time': 2,
                    'resources_out': [1]
                },
                2: {//shop
                    'build_time': 3,
                    'resources_out': []
                }
            }
        };
        module.exports.regions = models.regions = db.define('map_regions', {
            id: {type: 'serial', key: true},
            name: String,
            x: {type: 'integer', defaultValue: 0},
            y: {type: 'integer', defaultValue: 0}
        });
        module.exports.fields = models.fields = db.define('map_fields', {
            id: {type: 'serial', key: true},
            region_id: {type: 'integer', defaultValue: 0},
            x: {type: 'integer', defaultValue: 0},
            y: {type: 'integer', defaultValue: 0}
        },{autoFetch: true});
        module.exports.contracts = models.contracts = db.define('contracts', {
            id: {type: 'serial', key: true},
            goods_id: {type: 'integer', defaultValue: 0},
            dest_id: {type: 'integer', defaultValue: 0},
            count: {type: 'integer', defaultValue: 0},
            type: {type: 'integer', defaultValue: 0},
            done: {type: 'boolean', defaultValue: 0}
        });
        module.exports.goods = models.goods = db.define('goods', {
            id: {type: 'serial', key: true},
            product_type: {type: 'integer', defaultValue: 0},
            count: {type: 'integer', defaultValue: 0},
            quality: {type: 'number', defaultValue: 0},
            reserved: {type: 'integer', defaultValue: 0},
            price: {type: 'number', defaultValue: 0},
            'export': {type: 'integer', defaultValue: 0},
            'export_count': {type: 'integer', defaultValue: 0}
        },{
            methods: {
                add: function (count, quality) {
                    var goods = this;
                    var old_count = goods.count;
                    var old_quality = goods.quality;
                    goods.quality = (old_quality * old_count + quality * count) / (old_count + count);
                    goods.count = (old_count + count);
                    goods.save();
                },
                take: function(count, cb) {
                    var taken = {};
                    taken.quality = this.quality;
                    if (this.count >= count) {
                        this.count -= count;
                        taken.count = count;
                        this.save()
                    } else {
                        taken.count = this.count;
                        this.remove()
                    }
                    if (cb) {cb(taken)};
                }
            }
        });
        models.goods.hasOne('building', models.buildings);
        models.buildings.hasOne('field', models.fields);
        models.fields.hasOne('region', models.regions);
        next();
    }
};