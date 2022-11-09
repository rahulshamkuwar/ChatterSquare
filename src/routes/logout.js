const express = require("express");
const logout_controller = require("../controllers/logoutController");

const router = express.Router();

router.get("/", logout_controller.logout_get);

module.exports = router;