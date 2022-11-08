const bcrypt = require("bcrypt");
const url = require('url');
const db = require("../services/database");

exports.register_get = (req, res) => {
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
        error: false,
        errorMessage: ""
      }
    }));
  }).catch((err) => {
    console.log(err);
    if (err.constraint === "users_pkey") {
      res.status(400).render("pages/register", {
        message: "The user provided already exists.",
        error: true,
        errorMessage: err
      });
    } else {
      res.status(500).render("pages/register", {
        message: "There was an error inserting to database.",
        error: true,
        errorMessage: err
      });
    }
  });
};