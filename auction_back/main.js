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
const http = require('http');
const https = require('https');
const httpPort = 3002;
const httpsPort = 3001;
const options = require('./lib/config/pem_config').options;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(flash());

if (os.version().includes('Windows')) {
    app.use(express.static(`C:/auction`));
} else {
    app.use(express.static(`/home/ubuntu/auction`));
}

// CORS 설정 -----------------------------------------------------------------------------------------------------------
if (os.version().includes('Windows')) {
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );
} else {
    app.use(
        cors({
            origin: 'https://bidbird.kro.kr',
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );
}
// CORS 설정 끝 -----------------------------------------------------------------------------------------------------------

// 세션 설정 -----------------------------------------------------------------------------------------------------------
const sessionOptions = {
    host: 'auctiondb.c5ekqsck8dcp.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'DB_BIDBIRD',
};
const sessionStore = new MySQLStore(sessionOptions);

const maxAge = 1000 * 60 * 30;
const sessionObj = {
    secret: 'Dhyonee',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: maxAge,
        ...(os.version().includes('Windows') ? {} : { domain: 'bidbird.kro.kr' }),
    },
};

app.use(session(sessionObj));
// 세션 설정 끝 -----------------------------------------------------------------------------------------------------------

// Passport 설정 -----------------------------------------------------------------------------------------------------------
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
// Passport 설정 끝 -----------------------------------------------------------------------------------------------------------

// 라우터 설정 -----------------------------------------------------------------------------------------------------------
app.use('/member', require('./routes/memberRouter'));
app.use('/admin', require('./routes/adminRouter'));
app.use('/auction', require('./routes/auctionRouter'));
app.use('/point', require('./routes/pointRouter'));
app.use('/customer_center', require('./routes/customerCenterRouter'));
app.use('/alarm', require('./routes/alarmRouter'));
app.use('/home', require('./routes/homeRouter'));
// 라우터 설정 끝 -----------------------------------------------------------------------------------------------------------

// 서버 설정 -----------------------------------------------------------------------------------------------------------
if (os.version().includes('Windows')) {
    const server = http.createServer(app);
    const initializeSocket = require('./lib/websocket/initializeSocket');
    initializeSocket(server, 'http://localhost:3000', options);
    server.listen(httpPort, () => {
        console.log(`HTTP: Express listening on port ${httpPort}`);
    });
} else {
    const server = https.createServer(options, app);
    const initializeSocket = require('./lib/websocket/initializeSocket');
    initializeSocket(server, 'https://bidbird.kro.kr', options);
    server.listen(httpsPort, () => {
        console.log(`HTTPS: Express listening on port ${httpsPort}`);
    });
}
// 서버 설정 끝 -----------------------------------------------------------------------------------------------------------
