const DB = require('../db/db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const google = require('../config/google.json');

exports.passport = (app) => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((id, done) => {
        done(null, id);
    });

    passport.use(new LocalStrategy({
        usernameField: 'm_id',
        passwordField: 'm_pw'
    }, function(username, password, done) {
        
        DB.query('SELECT * FROM TBL_MEMBER WHERE M_ID = ?', [username], (err, member) => {

            if (member.length == 0) {
                
                DB.query('SELECT * FROM TBL_ADMIN WHERE A_ID = ?', [username], (err, admin) => {
                    if (admin.length == 0)
                        return done(null, false, { message: '아이디를 찾을 수 없습니다.' });

                    else if (!bcrypt.compareSync(password, admin[0].A_PW))
                        return done(null, false, { message: '비밀번호가 일치하지 않습니다.' })

                    else {
                        if (admin[0].A_ID == 'super')
                            return done(null, admin[0].A_ID);

                        return done(null, admin[0].A_ID);
                    }
                })

            }
    
            else if (!bcrypt.compareSync(password, member[0].M_PW))
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' })

            else {
                return done(null, member[0].M_ID);
            }
        })
    }))

    passport.use(new GoogleStrategy({
        clientID: google.web.client_id,
        clientSecret: google.web.client_secret,
        callbackURL: google.web.redirect_uris[0]
    },
        function(accessToken, refreshToken, profile, done) {
            let email =  profile.emails[0].value;
            let googleId = profile.id;
        
            DB.query(`SELECT * FROM TBL_MEMBER WHERE M_MAIL = ?`, [email], (err, member) => {
                if (err) {
                    console.log(err);
                    return done(null, false, { message: '구글 로그인에 실패했습니다.' });
                }
        
                if (member.length == 0) {
        
                    DB.query(`INSERT INTO TBL_MEMBER(M_ID, M_GOOGLE_ID, M_PW, M_MAIL, M_PHONE) VALUES(?, ?, ?, ?, ?)`,
                    [email, googleId, bcrypt.hashSync(shortid(), 10), email, '--'],
                    (err, rst) => {
                        if (err) {
                            console.log(err);
                            return done(null, false, { message: '구글 로그인에 실패했습니다.' });
                        }
        
                        return done(null, email);
                    })
        
                } else {
                    DB.query(`UPDATE TBL_MEMBER SET M_GOOGLE_ID = ? WHERE M_MAIL = ?`,
                    [googleId, email], (err, rst) => {
                        if (err) {
                            console.log(err);
                            return done(null, false, { message: '구글 로그인에 실패했습니다.' });
                        }
        
                        return done(null, member[0]);
                    })
                }
            })
        }
    ));

    return passport;

}
        
