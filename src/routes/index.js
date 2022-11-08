const express = require("express");
<<<<<<< HEAD
=======
const session = require("express-session");
>>>>>>> a44781a (refactor socketio code to be a node service)

const router = express.Router();

// For now redirects to login.
// TODO: Change to redirect to the square page when it is implemented.
router.get("/", (req, res) => {
<<<<<<< HEAD
  res.redirect("/login");
=======
  res.redirect("/square");
>>>>>>> a44781a (refactor socketio code to be a node service)
});

module.exports = router;