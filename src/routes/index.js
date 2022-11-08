const express = require("express");

const router = express.Router();

// For now redirects to login.
// TODO: Change to redirect to the square page when it is implemented.
router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
