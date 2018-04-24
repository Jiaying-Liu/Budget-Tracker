const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, 
    async (accessToken, refreshToken, profile, done) => {
        var existingUser = await User.findOne({ googleId: profile.id });
        console.log('profile is ', profile);
        if(existingUser) {
            // refresh the name each time so that the app
            // is refreshes everytime the display name is
            // changed.
            existingUser.name = profile.displayName;
            existingUser = await existingUser.save();
            done(null, existingUser);
        } 
        else {
        //new User({ googleId: profile.id });
            const user = await new User({ googleId: profile.id, name: profile.displayName }).save();
            done(null, user);
        }
    })
);
