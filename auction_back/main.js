const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const flash = require('express-flash');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(flash());

// CORS START -----------------------------------------------------------------------------------------------------------
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// CORS END -----------------------------------------------------------------------------------------------------------

// session setting START -----------------------------------------------------------------------------------------------------------
const options = {
    host: '13.238.114.78',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'DB_BIDBIRD'
};
const sessionStore = new MySQLStore(options);

const maxAge = 1000 * 60 * 30;
const sessionObj = {                
    secret: 'Dhyonee',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: maxAge,
    },
}

app.use(session(sessionObj));
// session setting END -----------------------------------------------------------------------------------------------------------

// passport setting START -----------------------------------------------------------------------------------------------------------
let pp = require('./lib/passport/passport');
let passport = pp.passport(app);

app.post('/member/login_confirm', passport.authenticate('local', {
    successRedirect: '/member/login_success',
    failureRedirect: '/member/login_fail',
    successFlash: true,
    failureFlash: true
}));

// passport setting END -----------------------------------------------------------------------------------------------------------


// 라우터 설정 -----------------------------------------------------------------------------------------------------------
app.use('/member', require('./routes/memberRouter'));
app.use('/admin', require('./routes/adminRouter'));
app.use('/auction',require('./routes/auctionRouter'));
// 라우터 설정 끗 -----------------------------------------------------------------------------------------------------------

app.listen(3001);