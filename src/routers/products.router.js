const express = require('express');
const Products = require('../controllers/products.controller');

const router = express.Router();

router.get('/', Products.findAll);

module.exports = router;
