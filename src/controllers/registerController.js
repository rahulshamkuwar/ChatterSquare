const bcrypt = require("bcrypt");
const url = require('url');
const db = require("../services/database");

exports.register_get = (req, res) => {
  req.query.session = req.session;
  req.query.pathname = "/register";
  res.status(200).render("pages/register", req.query);
};

exports.register_post = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.newUser({username: username, password: hashedPassword}).then(() => {
    res.redirect(url.format({
      pathname:"/login",
      query: {
        message: "Account successfully created.",
      }
    }));
  }).catch((err) => {
    console.log(err);
    if (err.constraint === "users_username_key") {
      res.status(400).render("pages/register", {
        message: "The user provided already exists.",
        error: true,
        errorMessage: err,
        pathname: "/register"
      });
    } else {
      res.status(500).render("pages/register", {
        message: "There was an error inserting to database.",
        error: true,
        errorMessage: err,
        pathname: "/register"
      });
    }
  });
};