const express = require("express");
const profile_controller = require("../controllers/profileController");

const router = express.Router();

// Render profile page
router.get('/', profile_controller.profile_get);

router.post('/change_password', profile_controller.profile_post_change_password);

router.post('/change_username', profile_controller.profile_post_change_username);

router.post('/change_profile_picture', profile_controller.profile_post_change_profile_picture);

router.post('/update_perks', profile_controller.profile_post_update_perks);

module.exports = router;