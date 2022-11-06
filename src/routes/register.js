const express = require("express");
const register_controller = require("../controllers/registerController");

const router = express.Router();

// Render register page
router.get('/', register_controller.register_get);

// Register Auth
router.post('/', register_controller.register_post);

module.exports = router;