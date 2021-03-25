
/*
Passport for username/password authentication
*/
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'username',
        }, (username, password, done) => {
            //Match User
            User.findOne({ username: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Username is not registered' });
                    }

                    //Match password

                    bcrypt.compare(password, user.password, (err, isEqual) => {
                        if (err) throw err;

                        if (isEqual) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err))
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}

