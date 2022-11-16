const express = require("express");
const profile_controller = require("../controllers/profileController");

const router = express.Router();

// Render profile page
router.get('/', profile_controller.profile_get);

router.post('/change_password', profile_controller.profile_post_change_password);

module.exports = router;