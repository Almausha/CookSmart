const express = require('express');
const router  = express.Router();
const { getPantryItems, createPantryItem, updatePantryItem, deletePantryItem } = require('../controllers/pantrycontroller');

router.route('/')
  .get(getPantryItems)
  .post(createPantryItem);

router.route('/:id')
  .put(updatePantryItem)
  .delete(deletePantryItem);

module.exports = router;