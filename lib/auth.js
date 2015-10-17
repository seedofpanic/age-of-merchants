var models = require(__dirname + '/models.js');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        models.users.find({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user[0]) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user[0].validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user[0]);
        });
    }
));

var auth = {
    init: function () {

    }
};

module.exports = auth;