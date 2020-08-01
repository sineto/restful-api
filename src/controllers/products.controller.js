const db = require('../database/mysql.config');
const Products = require('../services/mysql/product.service')(db);

const findAll = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    let products;

    if (req.query.categoryId) {
      products = await Products.findAllByCategory(req.query.categoryId);
    } else {
      products = await Products.findAllPaginated({ limit, offset });
    }

    return res.status(200).send(products);
  } catch (error) {
    next(error);
  }
}; 

const findById = async (req, res, next) => {
  try {
    const [ product ] = await Products.findById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    next(error); 
  }
};

const create = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const [ product ] = await Products.create([name, price]);
    return res.status(201).send({ 
      message: 'Product successfully created',
      product 
    });
  } catch (error) {
    next(error); 
  }
};

const createImages = async (req, res, next) => {
  try {
    const { description, url } = req.body;
    await Products.createImages(req.params.id ,[description, url]); 
    const product = await Products.findById(req.params.id);
    return res.status(201).send({ 
      message: `Images successfully added to product id ${req.params.id}`,
      product 
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const [ product ] = await Products.update(req.params.id, [name, price]);
    return res.status(200).send({ 
      message: 'Product successfully updated',
      product 
    });
  } catch (error) {
    next(error); 
  }
};

const destroy = async (req, res, next) => {
  try {
    await Products.destroy(req.params.id);
    return res.status(200).send({ message: 'Product successfully deleted' });
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  findAll,
  findById,
  create,
  createImages,
  update,
  destroy,
};

