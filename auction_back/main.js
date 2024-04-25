const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const { MemoryStore } = require('express-session');
const session = require('express-session');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// CORS START
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// CORS END

const maxAge = 1000 * 60 * 30;
const sessionObj = {                
    secret: 'Dhyonee',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: {
        maxAge: maxAge,
    },
}

app.use(session(sessionObj));

// passport START
let pp = require('./lib/passport/passport');
let passport = pp.passport(app);

app.get('/member/login_confirm', passport.authenticate('local', {
    successRedirect: '/login_success',
    failureRedirect: '/login_fail',
}));

// 로그인 성공 시
app.get('/login_success', (req, res) => {
    console.log('login_success ::: req.user --> ', req.user);

    res.json({
        'sessionID': req.sessionID,
        'mId': req.user,
    });

});

// 로그인 실패 시
app.get('/login_fail', (req, res) => {
    console.log('login_fail');

    res.json(null);

});
// passport END


app.get('/node', (req, res) => {
    res.send('노드 연결 성공 ^0^');
})

// 라우터 설정
app.use('/member', require('./routes/memberRouter'));

app.listen(3001);