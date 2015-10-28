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
        type: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function () {
              this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
              this.belongsTo(db.models.profiles, {foreignKey: 'profile_id'});
            },
            new: function (profile, regoion_id, x, y, type, name, cb) {
                var params = db.models.buildings.params[type];
                if (profile.gold < params.price) {
                    cb('not_enoth_gold');
                    return;
                }
                db.models.fields.find({where: {region_id: regoion_id, x: x, y: y}}).then(function (field) {
                    var new_building = {
                        profile_id: profile.id,
                        type: type,
                        name: name,
                        field_id: field.id,
                        buildtime: params.build_time,
                        status: 0
                    };
                    db.models.buildings.create(new_building).then(function (building) {
                        profile.gold -= params.price;
                        profile.save();
                        cb(null, building);
                    });
                });
            },
            'modes': {
                MINE: 1,
                TOWN: 2,
                FACTORY: 3
            },
            'params': {
                0: {//sawmill
                    'build_time': 1,
                    'resources_out': [{
                        type: 2,
                        count: 100,
                        mode: 1
                    }],
                    price: 100
                },
                1: {//hunting
                    'build_time': 2,
                    'resources_out': [{
                        type: 1,
                        count: 10,
                        mode: 1
                    }],
                    price: 500
                },
                2: {//shop
                    'build_time': 3,
                    'resources_out': [],
                    price: 1000
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
                    price: 0,
                    upkeep: 1
                },
                4: {//school
                    build_time: 1,
                    resources_out: [
                        {
                            type: 4,
                            count: 1,
                            need: [{type: 3, count: 1}],
                            mode: 3
                        }
                    ],
                    price: 100
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
                            product_type: product_type
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