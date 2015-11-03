module.exports = function (db, DataTypes) {
    return db.define("soldiers", {
        'id': {
            type: DataTypes.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
        },
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
    });

};