var passwordHash = require('password-hash');
module.exports = function (db, cb) {
    db.define("users", {
        id: {type: 'serial', key: true},
        email: String,
        username: String,
        password: String,
        logins: {type: 'integer', defaultValue: 0},
        last_login: {type: 'integer', defaultValue: 0}
    }, {
        methods: {
            validPassword: function (password) {
                return passwordHash.verify(password, this.password);
            },
            setPassword: function (password) {
                this.password = passwordHash.generate(password);
                this.save();
            }
        }
    });
    return cb();
};