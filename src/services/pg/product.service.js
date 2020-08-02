const newError = require('../../utils/new-error');

const init = (db) => {
  const findAll = async () => {
    const { rows } = await db.query('select * from products');
    if (!rows[0]) {
      throw newError(404, 'Products not found');
    }

    return rows;
  };

  const findAllPaginated = async ({ limit = 10, offset = 0, orderBy = 'id', order = 'ASC' } = {}) => {
    const { rows } = await db.query(`select * from products order by ${orderBy} ${order} limit ${limit + 1} offset ${offset * limit}`);
    if (!rows[0]) {
      throw newError(404, 'Products not found');
    }

    const prodIds = rows.map((item) => item.id).join(',');
    const { rows: imgProds } = await db.query(`select * from images where product_id in (${prodIds})`);

    const products = rows.map((prod) => {
      return {
        ...prod,
        images: imgProds.filter((img) => img.product_id === prod.id)
      };
    });

    const hasNext = rows.length > limit;
    if (hasNext) {
      products.pop();
    }

    return {
      data: products,
      hasNext
    }
  };

  const findById = async (id) => {
    const { rows } = await db.query('select * from products where id = $1', [id]);
    if (!rows[0]) {
      throw newError(404, 'Product not found');
    }

    return rows[0];
  };

  const create = async (data) => {
    const { rows } = await db.query('insert into products (name, price) values ($1, $2) RETURNING *', data);
    if (!rows[0]) {
      throw newError(500, 'Failed to create product');
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
    findById,
    create,
    update,
    destroy,
  };
};

module.exports = init;
