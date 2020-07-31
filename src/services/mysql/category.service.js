const init = (connection) => {

  const findAll = async ({ orderBy = 'id', order = 'ASC'}) => {
    const conn = await connection;
    const [ result ] = await conn.query(`select * from categories order by ${orderBy} ${order}`);
    if (result.length === 0) {
      throw new Error('Categories not found');
    }

    return result;
  };

  const findById = async (id) => {
    const conn = await connection;
    const [ category ] = await conn.query('select * from categories where id = ?', [id]);
    if (category.length === 0) {
      throw new Error(`Category id ${id} not found`);
    }

    return category;
  };

  const create = async (data) => {
    const conn = await connection;
    const [ result ] = await conn.query('insert into categories (name) values (?)', data);
    if (result.length === 0) {
      throw new Error('Failed to create a category');
    } 

    return findById(result.insertId);
  };

  const update = async (id, data) => {
    const conn = await connection;
    const [ result ] = await conn.query('update categories set name = ? where id = ?', [ ...data, id ]);
    if (result.length === 0) {
      throw new Error('Failed to update a category');
    }

    return findById(id);
  };

  const destroy = async (id) => {
    const conn = await connection;
    const [ result ] = await conn.query('delete from categories where id = ?', [id]);
    if (result.length === 0) {
      throw new Error('Failed to delete a category');
    }

    return;
  };

  return {
    findAll,
    findById,
    create,
    update,
    destroy
  };
};

module.exports = init;
