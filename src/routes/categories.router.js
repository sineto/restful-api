const express = require('express');
const { 
  findAll,
  findById,
  create,
  update,
  destroy,
} = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
