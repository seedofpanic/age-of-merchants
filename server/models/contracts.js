module.exports = function (db, DataTypes) {
    return db.define('contracts', {
        product_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "products",
                key: "id"
            }
        },
        dest_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "buildings",
                key: "id"
            }
        },
        count: DataTypes.BIGINT,
        type: DataTypes.INTEGER,
        done: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.products, {foreignKey: 'product_id'});
                this.belongsTo(db.models.buildings, {foreignKey: 'dest_id'});
            }
        },
        check: function (id, user_id) {
            return this.find({where: {id: id}, include: {model: db.models.buildings, required: true, include: {model: db.models.profiles, required: true, where: {user_id: user_id}}}});
        }
    });
};