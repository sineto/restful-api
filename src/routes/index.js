const express = require('express');
const ProductsRouter = require('./products.router');

const router = express.Router();

router.use('/products', ProductsRouter);

module.exports = router;

