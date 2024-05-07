const DB = require('../db/db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const google = require('../config/google.json');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const naver = require('../config/naver.json');

exports.passport = (app) => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        done(null, id);
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'm_id',
                passwordField: 'm_pw',
            },
            function (username, password, done) {
                console.log('🚀 ~ password:', password);
                console.log('🚀 ~ username:', username);

                DB.query('SELECT * FROM TBL_MEMBER WHERE M_ID = ?', [username], (err, member) => {
                    console.log('🚀 ~ DB.query ~ member:', member);
                    if (member.length == 0) {
                        DB.query('SELECT * FROM TBL_ADMIN WHERE A_ID = ?', [username], (err, admin) => {
                            if (admin.length == 0) return done(null, false, { message: '아이디를 찾을 수 없습니다.' });
                            else if (!bcrypt.compareSync(password, admin[0].A_PW))
                                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                            else {
                                if (admin[0].A_ID == 'super') return done(null, admin[0].A_ID);

                                return done(null, admin[0].A_ID);
                            }
                        });
                    }
                    console.log(
                        '🚀 ~ DB.query ~ bcrypt.compareSync(password, member[0].M_PW):',
                        bcrypt.compareSync(password, member[0].M_PW)
                    );

                    if (!bcrypt.compareSync(password, member[0].M_PW))
                        return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    else {
                        return done(null, member[0].M_ID);
                    }
                });
            }
        )
    );

    // GOOGLE SETTING START
    app.get(
        '/auth/google',
        cors({
            origin: 'http://localhost:3000',
            methods: ['GET'],
        }),
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
        })
    );

    const client = new OAuth2Client(google.web.client_id, google.web.client_secret, google.web.redirect_uris[0]);

    async function getAccessToken(code) {
        const { tokens } = await client.getToken(code);
        return tokens.access_token;
    }

    async function getGoogleProfile(accessToken) {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return data;
    }

    app.post(
        '/auth/google/callback',
        cors({
            origin: 'http://localhost:3000',
            methods: ['POST'],
        }),
        async (req, res) => {
            const { code } = req.body;
            const accessToken = await getAccessToken(code); // await 추가
            const profile = await getGoogleProfile(accessToken); // await 추가

            // 프로필 정보를 활용하여 사용자 조회 또는 생성
            DB.query(`SELECT * FROM TBL_MEMBER WHERE M_MAIL = ?`, [profile.email], (err, member) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: '구글 로그인에 실패했습니다.' });
                }

                if (member.length == 0) {
                    DB.query(
                        `INSERT INTO TBL_MEMBER(M_ID, M_SOCIAL_ID, M_PW, M_MAIL, M_PHONE) VALUES(?, ?, ?, ?, ?)`,
                        [`G_${profile.id}`, `G_${profile.id}`, bcrypt.hashSync(shortid(), 10), profile.email, '--'],
                        (err, rst) => {
                            if (err) {
                                console.log(err);
                                return res.json({ success: false, message: '구글 로그인에 실패했습니다.' });
                            }

                            const user = {
                                id: `G_${profile.id}`,
                                name: profile.name,
                            };

                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.json({ success: false, message: '구글 로그인에 실패했습니다.' });
                                }

                                return res.json({
                                    success: true,
                                    sessionID: req.sessionID,
                                    loginedId: `G_${profile.id}`,
                                });
                            });
                        }
                    );
                } else {
                    DB.query(
                        'UPDATE TBL_MEMBER SET M_SOCIAL_ID = ? WHERE M_MAIL = ?',
                        [`G_${profile.id}`, profile.email],
                        (err, rst) => {
                            const user = {
                                id: member[0].M_ID,
                                name: member[0].M_NAME,
                            };

                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.json({ success: false, message: '구글 로그인에 실패했습니다.' });
                                }

                                return res.json({
                                    success: true,
                                    sessionID: req.sessionID,
                                    loginedId: member[0].M_ID,
                                });
                            });
                        }
                    );
                }
            });
        }
    );
    // GOOGLE SETTING END

    // NAVER SETTING START
    app.get(
        '/auth/naver',
        cors({
            origin: 'http://localhost:3000',
            methods: ['GET'],
        }),
        passport.authenticate('naver', {
            scope: ['email'],
        })
    );

    async function getNaverAccessToken(code, state) {
        const { data } = await axios({
            method: 'POST',
            url: 'https://nid.naver.com/oauth2.0/token',
            params: {
                grant_type: 'authorization_code',
                client_id: naver.web.client_id,
                client_secret: naver.web.client_secret,
                code: code,
                state: state,
            },
        });
        return data.access_token;
    }

    async function getNaverProfile(accessToken) {
        const { data } = await axios({
            method: 'GET',
            url: 'https://openapi.naver.com/v1/nid/me',
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return data.response;
    }

    app.post(
        '/auth/naver/callback',
        cors({
            origin: 'http://localhost:3000',
            methods: ['POST'],
        }),
        async (req, res) => {
            const { code, state } = req.body;
            const accessToken = await getNaverAccessToken(code, state);
            const profile = await getNaverProfile(accessToken);

            DB.query(`SELECT * FROM TBL_MEMBER WHERE M_MAIL = ?`, [profile.email], (err, member) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: '네이버 로그인에 실패했습니다.' });
                }

                if (member.length == 0) {
                    DB.query(
                        `INSERT INTO TBL_MEMBER(M_ID, M_SOCIAL_ID, M_PW, M_MAIL, M_PHONE) VALUES(?, ?, ?, ?, ?)`,
                        [`N_${profile.id}`, `N_${profile.id}`, bcrypt.hashSync(shortid(), 10), profile.email, '--'],
                        (err, rst) => {
                            if (err) {
                                console.log(err);
                                return res.json({ success: false, message: '네이버 로그인에 실패했습니다.' });
                            }

                            const user = {
                                id: `N_${profile.id}`,
                                name: profile.nickname,
                            };

                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.json({ success: false, message: '네이버 로그인에 실패했습니다.' });
                                }

                                return res.json({
                                    success: true,
                                    sessionID: req.sessionID,
                                    loginedId: `N_${profile.id}`,
                                });
                            });
                        }
                    );
                } else {
                    DB.query(
                        'UPDATE TBL_MEMBER SET M_SOCIAL_ID = ? WHERE M_MAIL = ?',
                        [`N_${profile.id}`, profile.email],
                        (err, rst) => {
                            if (err) {
                                console.log(err);
                                return res.json({ success: false, message: '네이버 로그인에 실패했습니다.' });
                            }

                            const user = {
                                id: member[0].M_ID,
                                name: member[0].M_ID,
                            };

                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.json({ success: false, message: '네이버 로그인에 실패했습니다.' });
                                }

                                return res.json({
                                    success: true,
                                    sessionID: req.sessionID,
                                    loginedId: member[0].M_ID,
                                });
                            });
                        }
                    );
                }
            });
        }
    );
    // NAVER SETTING END

    return passport;
};
