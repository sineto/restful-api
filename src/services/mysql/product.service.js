const init = (connection) => {

  const findImages = async (results) => {
    const conn = await connection;
    const productIds = results.map((product) => product.id).join(',');
    const [ imageResults ] = await conn.query(`select * from images where product_id in (${productIds}) group by product_id`);

    const images = imageResults.reduce((acc, next) => {
      return {
        ...acc,
        [next.product_id]: next
      };
    }, {});

    const products = results.map((product) => {
      return {
        ...product,
        images: images[product.id]
      }
    });    

    return products;
  };

  const findAll = async ({ orderBy = 'id', order = 'ASC' }) => {
    const conn = await connection;
    const [ result ] = await conn.query(`select * from products order by ${orderBy} ${order}`);
    if (result.length === 0) {
      throw new Error('No products found');
    } 

    const products = await findImages(result);
    return products;
  };

  const findAllPaginated = async ({ limit = 10, offset = 0, orderBy = 'id', order = 'ASC' }) => {
    const conn = await connection;
    const [ result ] = await conn.query(`select * from products order by ${orderBy} ${order} limit ${limit * offset}, ${limit + 1}`)
    if (result.length === 0) {
      throw new Error('No products found');
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

  const findById = async (id) => {
    const conn = await connection;
    const [ result ] = await conn.query('select * from products where id = ?', [id]);
    if (result.length === 0) {
      throw new Error(`Failed to find product id ${id}`);
    }

    const product = await findImages(result);

    return product;
  };

  const create = async (data) => {
    const conn = await connection;
    const [ result ] = await conn.query('insert into products (name, price) values (?, ?)', data);
    if (result.length === 0) {
      throw new Error('Failed to create a new product');
    }

    return findById(result.insertId);
  };

  const createImage = async (productId, data) => {
    const conn = await connection;
    const [ result ] = await conn.query('insert into images (description, url, product_id) values (?, ?, ?)', [ ...data, productId ]);
    if (result.length === 0) {
      throw new Error('Failed to create an image');
    }

    return result;
  };

  const update = async (id, data) => {
    const conn = await connection;
    const [ result ] = await conn.query('update products set name = ?, price = ? where id = ?', [ ...data, id ]);
    if (result.length === 0) {
      throw new Error('Failed to update product');
    }

    return findById(id);
  };

  const updateCategories = async (productId, categoryIds) => {
    const conn = await connection;
    const [ result ] = await conn.query('delete from products_categories where product_id = ?', [productId]);
    if (result.length === 0) {
      throw new Error('Failed to update product categories');
    }

    for await (const category of categoryIds)  {
      await conn.query('insert into products_categories (product_id, category_id) values (?, ?)', [productId, category.id])
    }


  };

  const destroy = async (id) => {
    const conn = await connection;
    const [ result ] = await conn.query('delete from products where id = ?', [id]);
    if (result.length === 0) {
      throw new Error('Failed to delete product');
    }

    return;
  }; 

  return {
    findAll,
    findAllPaginated,
    findById,
    create,
    createImage,
    update,
    destroy,
  };
};

module.exports = init;
