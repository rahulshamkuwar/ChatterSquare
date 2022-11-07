const express = require("express");
const session = require("express-session");

const router = express.Router();

// For now redirects to login.
// TODO: Change to redirect to the square page when it is implemented.
router.get("/", (req, res) => {
  res.redirect("/square");
});

module.exports = router;