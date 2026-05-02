const express = require('express');
const router  = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getRecentActivity,
} = require('../controllers/userManageController');



router.get('/',              getAllUsers);       // GET  /api/admin/users
router.get('/activity',      getRecentActivity); // GET  /api/admin/users/activity
router.get('/:id',           getUserById);       // GET  /api/admin/users/:id
router.delete('/:id',        deleteUser);        // DELETE /api/admin/users/:id

module.exports = router;
