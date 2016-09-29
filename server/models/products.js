module.exports = function (db, DataTypes) {
    return db.define('products', {
        building_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "buildings",
                key: "id"
            }
        },
        product_type: DataTypes.INTEGER,
        count: DataTypes.BIGINT,
        quality: DataTypes.DECIMAL(10, 2),
        reserved: DataTypes.BIGINT,
        price: DataTypes.DECIMAL(10, 2),
        'export': DataTypes.BOOLEAN,
        'export_count': DataTypes.BIGINT,
        is_army: DataTypes.BOOLEAN
    },{
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.buildings, {foreignKey: 'building_id'});
                this.hasOne(db.models.contracts, {foreignKey: 'product_id'});
            },
            check: function (id, user_id) {
                return this.find({where: {id: id}, include: {model: db.models.buildings, required: true, include: {model: db.models.profiles, required: true, where: {user_id: user_id}}}});
            }
        },
        instanceMethods: {
            add: function (count, quality) {
                var product = this;
                var old_count = product.count || 0;
                var old_quality = product.quality || 0;
                product.quality = (old_quality * old_count + quality * count) / (old_count + count) || 0;
                product.count = (old_count + count);
                return product.save();
            },
            take: function(count, cb) {
                var taken = {};
                taken.quality = this.quality;
                if (this.count >= count) {
                    this.count -= count;
                    taken.count = count;
                    return this.save();
                } else {
                    taken.count = this.count;
                    return this.remove();
                }
            }
        }
    });
};