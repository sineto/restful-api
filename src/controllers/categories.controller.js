// const db = require('../database/mysql.config');
// const Products = require('../services/mysql/category.service')(db);
const db = require('../database/pg.config');
const Products = require('../services/pg/category.service')(db);

const findAll = async (req, res, next) => {
  try {
    const { orderBy, order } = req.query; 
    const categories = await Products.findAll({orderBy, order}); 
    res.status(200).send(categories);
  } catch (error) {
    next(error); 
  }
};

const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Products.findById(id);
    res.status(200).send(category);
  } catch (error) {
    next(error); 
  }
};

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Products.create([name]); 
    res.status(201).send({
      message: 'Category successfully created',
      category
    });
  } catch (error) {
    next(error); 
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Products.update(id, [name]);
    res.status(200).send({
      message: 'Category successfully updated',
      category
    });
  } catch (error) {
    next(error); 
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Products.destroy(id);
    res.status(200).send({ message: 'Category successfully deleted '});
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  destroy
};
