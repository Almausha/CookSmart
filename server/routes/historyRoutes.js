const express = require('express');
const router = express.Router();
const { saveHistory, getUserHistory, deleteHistory } = require('../controllers/historyController');

router.post('/', saveHistory);
router.get('/:userId', getUserHistory);
router.delete('/:historyId', deleteHistory);

module.exports = router;
