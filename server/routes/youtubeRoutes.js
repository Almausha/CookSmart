const express = require("express");
const router = express.Router();
const youtubeController = require("../controllers/youtubeController");

router.get("/:id", youtubeController.getVideoData);

module.exports = router;