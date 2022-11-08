const express = require("express");
const profile_controller = require("../controllers/profileController");

const router = express.Router();

// Render profile page
router.get('/', profile_controller.profile_get);

module.exports = router;