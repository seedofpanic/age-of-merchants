module.exports = function (db, DataTypes) {

    return db.define('dialogs', {
    }, {
        classMethods: {
            associate: function () {
                this.hasMany(db.models.users, {foreignKey: 'dialog_id'});
                this.hasMany(db.models.messages, {foreignKey: 'dialog_id'});
            }
        }
    });

};