const express = require("express");
const login_controller = require("../controllers/loginController");

const router = express.Router();


// Render login
router.get('/', login_controller.login_get);

// Login Auth
router.post('/', login_controller.login_post);

// TODO: actually implement the auth flow, 
// the / endpoint should redirect to square,
// using this auth middleware to catch user who need to login and handle them seperatley
// const auth = (req, res, next) => {
//   if (!req.session.user) {
//     // Default to login page.
//     return res.redirect("/login");
//   }
//   next();
// };

// // Authentication Required
// router.use(auth);

module.exports = router;