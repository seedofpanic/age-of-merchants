var passwordHash = require('password-hash');
module.exports = function (db, DataTypes) {
    return db.define("users", {
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        logins: DataTypes.INTEGER,
        last_login: DataTypes.BIGINT
    }, {
        instanceMethods: {
            validPassword: function (password) {
                return passwordHash.verify(password, this.password);
            },
            setPassword: function (password) {
                this.password = passwordHash.generate(password);
                this.save();
            }
        }
    });
};