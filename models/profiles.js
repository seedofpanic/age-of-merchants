module.exports = function (db, DataTypes) {
    return db.define("profiles", {
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "users",
                key: "id"
            }
        },
        name: DataTypes.STRING,
        gold: DataTypes.DECIMAL(10, 2)
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.users, {foreignKey: 'user_id'});
            }
        }
    });

};