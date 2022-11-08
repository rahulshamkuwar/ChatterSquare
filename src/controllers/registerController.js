const bcrypt = require("bcrypt");
const url = require('url');
const db = require("../config/db.config").db;

exports.register_get = (req, res) => {
  res.status(200).render("pages/register", req.query);
};

exports.register_post = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users(username, password, isAdmin, points, profilePictre) VALUES ($1, $2, $3, $4, $5)";

  db.task("post/register", async task => {
    return await task.none(query, [username, hashedPassword, false, 0, ""]);
  }).then(() => {
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