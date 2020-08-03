// const db = require('../database/mysql.config');
// const Products = require('../services/mysql/product.service')(db);
const db = require('../database/pg.config');
const Products = require('../services/pg/product.service')(db);

const newError = require('../utils/new-error');

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
    const product = await Products.findById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    next(error); 
  }
};

const create = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const product = await Products.create([name, price]);
    return res.status(201).send({ 
      message: 'Product successfully created',
      product 
    });
  } catch (error) {
    next(error); 
  }
};

const createImage = async (req, res, next) => {
  try {
    const { description, url } = req.body;
    await Products.createImage(req.params.id ,[description, url]); 
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
    const product = await Products.update(req.params.id, [name, price]);
    return res.status(200).send({ 
      message: 'Product successfully updated',
      product 
    });
  } catch (error) {
    next(error); 
  }
};

const patch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, categories } = req.body;
    const oldProd = await Products.findById(req.params.id);

    if (!oldProd) {
      throw newError(404, 'Product not found');
    }

    if (name) {
      oldProd.name = name;
    }

    if (price) {
      oldProd.price = price;
    }

    await Products.update(id, [oldProd.name, oldProd.price]);

    if (categories) {
      await Products.updateCategories(id, categories);
    }

    const product = await Products.findById(id);

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
  patch,
  destroy,
};

