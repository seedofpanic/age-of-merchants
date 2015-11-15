module.exports = function (db, DataTypes) {

    return db.define('buildings', {
        name: DataTypes.STRING,
        field_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "fields",
                key: "id"
            }
        },
        profile_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "profiles",
                key: "id"
            }
        },
        buildtime: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        workers_c: DataTypes.INTEGER,
        workers_q: DataTypes.DECIMAL(10,2)
    }, {
        classMethods: {
            associate: function () {
              this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
              this.belongsTo(db.models.profiles, {foreignKey: 'profile_id'});
            },
            new: function (data, cb) {
                var params = db.models.buildings.params[data.type];
                if (data.profile.gold < params.price) {
                    cb('not_enoth_gold');
                    return;
                }
                db.models.fields.find({where: {region_id: data.region_id, x: data.x, y: data.y}}).then(function (field) {
                    var new_building = {
                        profile_id: data.profile.id,
                        type: data.type,
                        name: data.name,
                        field_id: field.id,
                        buildtime: params.build_time,
                        status: 0,
                        out_type: data.out_type,
                        mode: params.resources_out[data.out_type].mode
                    };
                    db.models.buildings.create(new_building).then(function (building) {
                        data.profile.gold -= params.price;
                        data.profile.save();
                        cb(null, building);
                    });
                });
            },
            check: function (id, user_id) {
                return this.find({where: {id: id}, include: {model: db.models.profiles, required: true, where: {user_id: user_id}}});
            },
            'modes': {
                MINE: 1,
                TOWN: 2,
                FACTORY: 3,
                SHOP: 4
            },
            is_army: {
              4: true
            },
            'params': {
                0: {//sawmill
                    'build_time': 1,
                    'resources_out': [{
                        type: 2,
                        count: 100,
                        mode: 1
                    }],
                    max_workers: 5,
                    price: 100
                },
                1: {//hunting
                    'build_time': 2,
                    'resources_out': [{
                        type: 1,
                        count: 10,
                        mode: 1
                    }],
                    max_workers: 5,
                    price: 100
                },
                3: {//village
                    build_time: 1,
                    resources_out: [
                        {
                            type: 3,
                            count: 5,
                            max: 250,
                            mode: 2
                        }
                    ],
                    max_workers: 5,
                    price: 50,
                    upkeep: 1
                },
                4: {//school
                    build_time: 2,
                    resources_out: [
                        {
                            type: 4,
                            count: 5,
                            need: [{type: 3, count: 1}, {type: 5, count: 1}],
                            mode: 3
                        }
                    ],
                    max_workers: 5,
                    price: 100
                },
                5: {//forge
                    build_time: 2,
                    resources_out: [
                        {
                            type: 5,
                            count: 5,
                            need: [{type: 2, count: 1}, {type: 6, count: 1}]
                        }
                    ],
                    max_workers: 5,
                    price: 200
                },
                6: {//metal mine
                    build_time: 2,
                    resources_out: [
                        {
                            type: 6,
                            count: 1
                        }
                    ],
                    max_workers: 5,
                    price: 100
                },
                7: {//castle
                    build_time: 3,
                    resources_out: [

                    ],
                    max_workers: 5,
                    upkeep: 10,
                    price: 10000
                },
                8: {//gold mine
                    build_time: 1,
                    resources_out: [
                        {
                            type: 0,
                            out: 100
                        }
                    ],
                    price: 300
                }
            }
        },
        instanceMethods: {
            addProducts: function (product_type, count, quality, cb) {
                var building = this;
                db.models.products.find({where: {building_id: building.id , product_type : product_type}}).then(function (product) {
                    if (product) {
                        product.add(count, quality);
                    } else {
                        new_product = {
                            building_id: building.id,
                            product_type: product_type,
                            is_army: db.models.buildings.is_army[product_type] || false
                        };
                        db.models.products.create(new_product).then(function (product) {
                            product.add(count, quality);
                            if (cb) {cb()}
                        });
                        return;
                    }
                    if (cb) {cb()}
                });
            }
        }
    });

};