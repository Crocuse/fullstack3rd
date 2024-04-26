const mysql = require('mysql');

const DBs = {
    DB_DEV: () => {
        return mysql.createConnection({
            host: '13.238.114.78',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            timezone: "Asia/Seoul",
        });
    },
    DB_LOCAL: () => {
        return mysql.createConnection({
            host: '13.238.114.78',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            "timezone": "+09:00"
        });
    },
    DB_PROD: () => {
        return mysql.createConnection({
            host: '13.238.114.78',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_BIDBIRD',
            dateStrings: true,
            "timezone": "+09:00"
        });
    }
}

module.exports = DBs;