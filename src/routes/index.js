const express = require('express');
const ProductsRouter = require('./products.router');
const CategoriesRouter = require('./categories.router');

const router = express.Router();

router.use('/products', ProductsRouter);
router.use('/categories', CategoriesRouter);

module.exports = router;

