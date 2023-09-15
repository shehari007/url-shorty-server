
var mysql = require('mysql2');
require('dotenv').config();

var pool = mysql.createPool({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

exports.pool = pool;
