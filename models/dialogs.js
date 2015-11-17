module.exports = function (db, DataTypes) {

    return db.define('dialogs', {
    }, {
        classMethods: {
            associate: function () {
                //this.hasMany(db.models.users, {foreignKey: 'dialog_id'});
                this.hasMany(db.models.messages, {foreignKey: 'dialog_id'});
            },
            check: function (id, user_id) {
                return db.models.dialogs_users.find({where: {dialog_id: id, user_id: user_id}});
            }
        }
    });

};