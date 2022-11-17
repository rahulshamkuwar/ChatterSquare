const express = require("express");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const profile_controller = require("../controllers/profileController");

const router = express.Router();

// Render profile page
router.get('/', profile_controller.profile_get);

router.post('/change_password', profile_controller.profile_post_change_password);

router.post('/change_profile_picture', upload.single("profilePicture"), profile_controller.profile_post_change_profile_picture);

module.exports = router;