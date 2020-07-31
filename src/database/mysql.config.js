const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'admin',
  database: 'devpleno'
});


module.exports = connection;
