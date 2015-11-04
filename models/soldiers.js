module.exports = function (db, DataTypes) {
    return db.define("soldiers", {
        troop_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "troops",
                key: "id"
            }
        },
        product_type: {
            type: DataTypes.INTEGER,
            unsigned: true
        },
        count: {
            type: DataTypes.BIGINT,
            unsigned: true
        },
        quality: {
            type: DataTypes.DECIMAL(10,2),
            unsigned: true
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.troops, {foreignKey: 'troop_id'});
            }
        }
    });

};