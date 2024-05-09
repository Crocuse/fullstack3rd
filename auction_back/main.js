const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const flash = require('express-flash');
const os = require('os');
const server = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(flash());

if (os.version().includes('Windows')) {
    app.use(express.static(`C:/acution`));
} else {
    app.use(express.static(`/home/ubuntu/acution`));
}

//SOCKET.IO -----------------------------------------------------------------------------------------------------------

const initializeSocket = require('./lib/websocket/initializeSocket');
initializeSocket(server);

//SOCKET.IO END -----------------------------------------------------------------------------------------------------------

// CORS START -----------------------------------------------------------------------------------------------------------
if (os.version().includes('Windows')) {
    app.use(
        cors({
            origin: ['http://localhost:3000', 'http://14.42.124.87:3000'],
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );
} else {
    app.use(
        cors({
            origin: ['http://localhost:3000', 'http://14.42.124.87:3000'],
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );
}
// CORS END -----------------------------------------------------------------------------------------------------------

// session setting START -----------------------------------------------------------------------------------------------------------
const options = {
    host: 'auctiondb.c5ekqsck8dcp.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'DB_BIDBIRD',
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
};

app.use(session(sessionObj));
// session setting END -----------------------------------------------------------------------------------------------------------

// passport setting START -----------------------------------------------------------------------------------------------------------
let pp = require('./lib/passport/passport');
let passport = pp.passport(app);

app.post(
    '/member/login_confirm',
    passport.authenticate('local', {
        successRedirect: '/member/login_success',
        failureRedirect: '/member/login_fail',
        successFlash: true,
        failureFlash: true,
    })
);

// passport setting END -----------------------------------------------------------------------------------------------------------

// 라우터 설정 -----------------------------------------------------------------------------------------------------------
app.use('/member', require('./routes/memberRouter'));
app.use('/admin', require('./routes/adminRouter'));
app.use('/auction', require('./routes/auctionRouter'));
app.use('/point', require('./routes/pointRouter'));
// 라우터 설정 끗 -----------------------------------------------------------------------------------------------------------

//app.listen(3001);
server.listen(3001);
