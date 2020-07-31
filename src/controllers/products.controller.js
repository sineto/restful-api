const db = require('../database/mysql.config');
const Products = require('../services/mysql/product.service')(db);

const findAll = async (request, response) => {
  try {
    const products = await Products.findAll({});
    response.send({
      success: true,
      products
    })
  } catch (error) {
    console.error('Internal error', error);
  }
}; 

module.exports = {
  findAll,
};

