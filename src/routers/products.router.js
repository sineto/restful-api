const express = require('express');
const { 
  findAll, 
  findById,
  create, 
  createImages,
  update,
  patch,
  destroy
} = require('../controllers/products.controller');

const router = express.Router();

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', create);
router.post('/:id/images', createImages);
router.put('/:id', update);
router.patch('/:id', patch);
router.delete('/:id', destroy);

module.exports = router;
