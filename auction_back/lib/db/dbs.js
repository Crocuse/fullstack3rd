const mysql = require('mysql');

const DBs = {
    DB_DEV: () => {
        return mysql.createConnection({
            host: 'auctiondb.c5ekqsck8dcp.ap-southeast-2.rds.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '12345678',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            timezone: "Asia/Seoul",
        });
    },
    DB_LOCAL: () => {
        return mysql.createConnection({
            host: 'auctiondb.c5ekqsck8dcp.ap-southeast-2.rds.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '12345678',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            "timezone": "+09:00"
        });
    },
    DB_PROD: () => {
        return mysql.createConnection({
            host: 'auctiondb.c5ekqsck8dcp.ap-southeast-2.rds.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '12345678',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            "timezone": "+09:00"
        });
    }
}

module.exports = DBs;