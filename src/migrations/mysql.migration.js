const db = require('../database/mysql.config');

const up = async () => {
  const conn = await db;
  await conn.query(`
    CREATE TABLE products (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NULL DEFAULT NULL,
      price FLOAT NULL DEFAULT NULL,
      PRIMARY KEY (id)
    );
  `);

  await conn.query(`
    CREATE TABLE categories (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NULL DEFAULT NULL,
      PRIMARY KEY (id)
    );
  `);

  await conn.query(`
    CREATE TABLE images (
      id INT NOT NULL AUTO_INCREMENT,
      description TEXT NULL DEFAULT NULL,
      url VARCHAR(500) NULL DEFAULT NULL,
      product_id INT NOT NULL,
      PRIMARY KEY (id),
      KEY fk_images_product_index (product_id),
      CONSTRAINT fk_images_product_constraint FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await conn.query(`
    CREATE TABLE products_categories (
      product_id INT NOT NULL,
      category_id INT NOT NULL,
      KEY fk_products_categories_index (product_id),
      CONSTRAINT fk_products_categories_constraint1 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_products_categories_constraint2 FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await conn.close();
};

const down = async () => {
  const conn = await db;

  await conn.query('DROP TABLE products_categories');
  await conn.query('DROP TABLE images');
  await conn.query('DROP TABLE categories');
  await conn.query('DROP TABLE products');
  await conn.close();
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
