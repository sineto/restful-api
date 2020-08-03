const newError = require('../../utils/new-error');

const init = (db) => {
  const findAll = async ({ orderBy = 'id', order = 'ASC' } = {}) => {
    const { rows } = await db.query(`select * from categories order by ${orderBy} ${order}`); 
    if (!rows[0]) {
      throw newError(404, 'Categories not found');
    }

    return rows;
  };

  const findById = async (id) => {
    const { rows } = await db.query('select * from categories where id = $1', [id]);
    if (!rows[0]) {
      throw newError(404, 'Category not found');
    }

    return rows[0];
  };

  const create = async (data) => {
    const { rows } = await db.query('insert into categories (name) values ($1) returning *', data);
    if (!rows[0]) {
      throw newError(500, 'Failed to create category');
    }

    return rows[0];
  };

  const update = async (id, data) => {
    const  { rows } = await db.query('update categories set name = $1 where id = $2 returning *', [...data, id]);
    if (!rows[0]) {
      throw newError(500, 'Failed to update category');
    }

    return rows[0];
  };

  const destroy = async (id) => {
    const { rowCount } = await db.query('delete from categories where id = $1', [id]);
    if (rowCount === 0) {
      throw newError(500, 'Failed to delete category');
    }

    return;
  };

  return {
    findAll,
    findById,
    create,
    update,
    destroy
  }
};

module.exports = init;
