import {UserModel, User} from "../models/users";
var models = require('../models/index');
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
        UserModel.findOne({username: username}).then((user: User) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
            .catch((err) => console.log(err));
    }
));

var auth = {
    init: function () {

    }
};

module.exports = auth;