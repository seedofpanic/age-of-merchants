module.exports = function (db, DataTypes) {

    return db.define('messages', {
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
        'msg': {
            type: DataTypes.TEXT
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.dialogs, {foreignKey: 'dialog_id'});
                this.belongsTo(db.models.users, {foreignKey: 'user_id'});
                this.hasOne(db.models.messages_news, {foreignKey: 'message_id', as: 'new'});
            }
        }
    });

};