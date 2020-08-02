const newError = require('../../utils/new-error');

const init = (db) => {
  const findImages = async (results) => {
    const prodIds = results.map((item) => item.id).join(',');
    const { rows: imgProds } = await db.query(`select * from images where product_id in (${prodIds})`);

    const products = results.map((prod) => {
      return {
        ...prod,
        images: imgProds.filter((img) => img.product_id === prod.id)
      };
    });

    return products;
  };

  const findAll = async () => {
    const { rows } = await db.query('select * from products');
    if (!rows[0]) {
      throw newError(404, 'Products not found');
    }

    const products = await findImages(rows);
    return products;
  };

  const findAllPaginated = async ({ limit = 10, offset = 0, orderBy = 'id', order = 'ASC' } = {}) => {
    const { rows } = await db.query(`select * from products order by ${orderBy} ${order} limit ${limit + 1} offset ${offset * limit}`);
    if (!rows[0]) {
      throw newError(404, 'Products not found');
    }

    const products = await findImages(rows);
    const hasNext = rows.length > limit;
    if (hasNext) {
      products.pop();
    }

    return {
      data: products,
      hasNext
    }
  };

  const findAllByCategory = async (categoryId) => {
    const { rows } = await db.query('select * from products where id in (select product_id from products_categories where category_id = $1)', [categoryId]);
    if (!rows[0]) {
      throw newError(404, 'Products not found');
    }

    const products = await findImages(rows);
    return products; 
  };

  const findById = async (id) => {
    const { rows } = await db.query('select * from products where id = $1', [id]);
    if (!rows[0]) {
      throw newError(404, 'Product not found');
    }

    const product = await findImages(rows);
    return product[0];
  };

  const create = async (data) => {
    const { rows } = await db.query('insert into products (name, price) values ($1, $2) RETURNING *', data);
    if (!rows[0]) {
      throw newError(500, 'Failed to create product');
    }

    return rows[0];
  };

  const createImage = async (productId, data) => {
    const { rows } = await db.query('insert into images (description, url, product_id) values ($1, $2, $3) returning *', [...data, productId]);
    if (!rows[0]) {
      throw newError(500, 'Failed to create product images');
    }

    return rows[0];
  };

  const update = async (id, data) => {
    const { rows } = await db.query('update products set name = $1, price = $2 where id = $3 returning *', [...data, id]);
    if (!rows[0]) {
      throw newError(500, 'Failed to update product');
    }

    return rows[0];
  };

  const updateCategories = async (productId, categories) => {
    try {
      await db.query('BEGIN');
      await db.query('delete from products_categories where product_id = $1', [productId]);
      for await (const categoryId of categories) {
        await db.query('insert into products_categories (product_id, category_id) values ($1, $2)', [productId, categoryId]);
      }
      await db.query('COMMIT');
    } catch (err) {
      throw newError(500, 'Transaction error'); 
    }    
  };

  const destroy = async (id) => {
    const { rowCount } = await db.query('delete from products where id = $1', [id]);
    if (rowCount === 0) {
      throw newError(500, 'Failed to delete product');
    }

    return;
  };

  return {
    findAll,
    findAllPaginated,
    findAllByCategory,
    findById,
    create,
    createImage,
    update,
    updateCategories,
    destroy
  };
};

module.exports = init;
