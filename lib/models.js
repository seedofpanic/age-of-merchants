var passwordHash = require('password-hash');
module.exports = {
    __init: function (db, models, next) {
        module.exports.users = models.users = db.define("users", {
            id: {type: 'serial', key: true},
            email: String,
            username: String,
            password: String,
            logins: {type: 'integer'},
            last_login: {type: 'integer'}
        }, {
            methods: {
                validPassword: function (password) {
                    return passwordHash.verify(password, this.password);
                }
            }
        });
        module.exports.buildings = models.buildings = db.define('buildings', {
            id: {type: 'serial', key: true},
            name: String,
            buildtime: {type: 'integer'},
            status: ['building','active'],
            type: ['sawmill','hunting','shop']
        }, {
            methods: {
                addGoods: function (product_id, count, quality) {
                    var building = this;
                    models.goods.one({building_id: building.id , product_id : product_id}, function (err, goods) {
                        if (goods) {
                            goods.add(count, quality);
                        } else {
                            new_goods = {
                                    building_id: building.id,
                                    product_id: product_id
                                };
                            models.goods.create(new_goods, function (err, goods) {
                                goods.add(count, quality);
                            });
                        }
                    });
                }
            }
        });
        module.exports.products = models.products = db.define('products', {
            id: {type: 'serial', key: true},
            name: String
        });
        module.exports.goods = models.goods = db.define('goods', {
            id: {type: 'serial', key: true},
            product_type: {type: 'integer', defaultValue: 0},
            count: {type: 'integer', defaultValue: 0},
            quality: {type: 'number', defaultValue: 0},
            reserved: {type: 'integer', defaultValue: 0},
            price: {type: 'number', defaultValue: 0},
            'export': {type: 'integer', defaultValue: 0}
        },{
            methods: {
                add: function (count, quality) {
                    var goods = this;
                    var old_count = goods.count;
                    var old_quality = goods.quality;
                    goods.quality = (old_quality * old_count + quality * count) / (old_count + count);
                    goods.count = (old_count + count);
                    goods.save();
                }
            }
        });
        models.goods.hasOne('building', models.buildings);
        next();
    }
};