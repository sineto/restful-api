const newError = require('../../utils/new-error');

const init = (connection) => {

  const findImages = async (results) => {
    const conn = await connection;
    const productIds = results.map((product) => product.id).join(',');
    const [ imageResults ] = await conn.query(`select * from images where product_id in (${productIds})`);

    const products = results.map((product) => {
      return {
        ...product,
      images: imageResults.filter((img) => img.product_id === product.id)
      }
    });    

    return products;
  };

  const findAll = async ({ orderBy = 'id', order = 'ASC' }) => {
    const conn = await connection;
    const [ result ] = await conn.query(`select * from products order by ${orderBy} ${order}`);
    if (result.length === 0) {
      throw newError(404, 'Products not found');
    } 

    const products = await findImages(result);
    return products;
  };

  const findAllPaginated = async ({ limit = 10, offset = 0, orderBy = 'id', order = 'ASC' } = {}) => {
    const conn = await connection;
    const [ result ] = await conn.query(`select * from products order by ${orderBy} ${order} limit ${limit * offset}, ${limit + 1}`)
    if (result.length === 0) {
      throw newError(404, 'Products not found');
    }

    const products = await findImages(result);
    
    const hasNext = result.length > limit;
    if (hasNext) {
      products.pop();
    }

    return {
      data: products,
      hasNext
    }
  };

  const findAllByCategory = async (categoryId) => {
    const conn = await connection;

    const [ result ] = await conn.query('select * from products where id in (select product_id from products_categories where category_id = ?)', [categoryId]);
    if (result.length === 0) {
      throw newError(404, 'Products not found');
    }

    const products = await findImages(result);
    return products;
  };

  const findById = async (id) => {
    const conn = await connection;
    const [ result ] = await conn.query('select * from products where id = ?', [id]);
    if (result.length === 0) {
      throw newError(404, 'Product not found');
    }

    const product = await findImages(result);

    return product[0];
  };

  const create = async (data) => {
    const conn = await connection;
    const [ result ] = await conn.query('insert into products (name, price) values (?, ?)', data);
    if (result.affectedRows === 0) {
      throw newError(500, 'Failed to create new product');
    }

    const product = await findById(result.insertId);
    return product;
  };

  const createImage = async (productId, data) => {
    const conn = await connection;
    const [ result ] = await conn.query('insert into images (description, url, product_id) values (?, ?, ?)', [ ...data, productId ]);
    if (result.affectedRows === 0) {
      newError(500, 'Failed to create image');
    }

    return result;
  };

  const update = async (id, data) => {
    const conn = await connection;
    const result = await conn.query('update products set name = ?, price = ? where id = ?', [ ...data, id ]);
    if (result.affectedRows === 0) {
      throw newError(500, 'Failed to update product');
    }

    const product = await findById(id);
    return product;
  };

  const updateCategories = async (productId, categoryIds) => {
    const conn = await connection;
    try {
      await conn.query('START TRANSACTION');
      await conn.query('delete from products_categories where product_id = ?', [productId]);
      for await (const categoryId of categoryIds)  {
        await conn.query('insert into products_categories (product_id, category_id) values (?, ?)', [productId, categoryId])
      }
      await conn.query('COMMIT');  
    } catch (error) {
      throw newError(500, 'Transaction error');       
    }
  };

  const destroy = async (id) => {
    const conn = await connection;
    const [ result ] = await conn.query('delete from products where id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('Failed to delete product');
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
    destroy,
  };
};

module.exports = init;
