const { Pool } = require('pg');

const connection = new Pool({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'devpleno',
  port: 5432
});

module.exports = connection;
