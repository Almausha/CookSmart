const express = require('express');
const router = express.Router();
const {
  getShoppingList,
  addToShoppingList,
  togglePurchased,
  removeItem,
  clearShoppingList
} = require('../controllers/shoppingListController');

router.get('/:userId', getShoppingList);
router.post('/add', addToShoppingList);
router.put('/toggle', togglePurchased);
router.delete('/item/:ingredientId', removeItem);
router.delete('/clear/:userId', clearShoppingList);

module.exports = router;
