const DB = require('../db/db');
const bcrypt = require('bcrypt');

exports.passport = (app) => {
    let passport = require('passport');
    let LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ', user);
        done(null, user.M_ID);

    });

    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser: ', id);
        done(null, id);

    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'm_id',
            passwordField: 'm_pw'
        },
        function(username, password, done) {
            console.log('LocalStrategy: ', username, password);

            DB.query(`SELECT * FROM TBL_MEMBER WHERE M_ID = ?`, 
            [username], 
            (error, member) => {

                if (error) {
                    return done(err);

                }  
                
                if (member.length > 0) {
                    if (bcrypt.compareSync(password, member[0].M_PW)) {
                        return done(null, member[0], { message: 'Welcome' });
        
                    } else {
                        return done(null, false, { message: 'INCORRECT MEMBER PW.' });

                    }
                    
                } else {
                    return done(null, false, { message: 'INCORRECT MEMBER ID.' });

                }
                
            });
        }
    ));

    return passport;

}