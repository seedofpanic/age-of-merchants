module.exports = function (db, DataTypes) {

    return db.define('messages_news', {
        'message_id': {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: "messages",
                key: "id"
            }
        },
        'user_id': {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: "users",
                key: "id"
            }
        },
        'dialog_id': {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: "users",
                key: "id"
            }
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.messages, {foreignKey: 'message_id'});
                this.belongsTo(db.models.users, {foreignKey: 'user_id'});
            }
        },
        timestamps: false
    });

};