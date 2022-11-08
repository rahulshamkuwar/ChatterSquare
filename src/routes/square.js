const express = require("express");
const square_controller = require("../controllers/squareController");

const router = express.Router();

// Render square page
router.get('/', square_controller.square_get);

module.exports = router;