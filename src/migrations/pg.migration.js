const db = require('../database/pg.config');

const up = async () => {
  // const conn = await db;
  await db.query(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) DEFAULT NULL,
      price NUMERIC DEFAULT NULL
    );
  `);

  await db.query(`
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) DEFAULT NULL
    );
  `);

  await db.query(`
    CREATE TABLE images (
      id SERIAL PRIMARY KEY,
      description TEXT DEFAULT NULL,
      url VARCHAR(500) DEFAULT NULL,
      product_id INTEGER REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await db.query(`
    CREATE TABLE products_categories (
      product_id INTEGER REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE,
      category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
};

const down = async () => {
  await db.query('DROP TABLE products_categories');
  await db.query('DROP TABLE images');
  await db.query('DROP TABLE categories');
  await db.query('DROP TABLE products');
};

const migrations = () => {
  if (process.argv[2] === 'up') {
    up();
    return;
  }

  if (process.argv[2] === 'down') {
    down();
    return;
  }
};

migrations();
