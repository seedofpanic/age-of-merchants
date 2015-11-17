module.exports = function (db, DataTypes) {

    return db.define('dialogs_users', {
        'dialog_id': {
            type: DataTypes.BIGINT,
            references: {
                model: "dialogs",
                key: "id"
            }
        },
        'user_id': {
            type: DataTypes.BIGINT,
            references: {
                model: "users",
                key: "id"
            }
        },
        'new': {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.dialogs, {foreignKey: 'dialog_id'});
                this.belongsTo(db.models.users, {foreignKey: 'user_id'});
                this.hasMany(db.models.messages, {foreignKey: 'user_id'});
            }
        }
    });

};