const express = require('express');
const router  = express.Router();
const { getPantryItems, createPantryItem, updatePantryItem, deletePantryItem } = require('../controllers/pantrycontroller');
const protect = require('../middleware/authMiddleware'); // will have to check if it's actually needed here or not.

router.route('/')
  .get(protect, getPantryItems)
  .post(protect, createPantryItem);

router.route('/:id')
  .put(protect, updatePantryItem)
  .delete(protect, deletePantryItem);

module.exports = router;