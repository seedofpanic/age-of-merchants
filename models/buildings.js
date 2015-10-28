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