const DBs = require('./dbs');

const DB = DBs.DB_DEV();
DB.connect();

module.exports = DB;