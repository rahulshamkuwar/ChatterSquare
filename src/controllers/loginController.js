const bcrypt = require("bcrypt");
const url = require('url');
const db = require("../services/database");

exports.login_get = (req, res) => {
  req.query.session = req.session;
  req.query.pathname = "/login";
  res.status(200).render("pages/login", req.query);
};

exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  await db.getUser({username: username}).then((user) => {
    bcrypt.compare(password, user.password).then(async (result) => {
      if (result) {
        const perks = await db.getPerks({userId: user.userid});
        req.session.user = {
          userId: user.userid,
          username: user.username,
          isAdmin: user.isadmin,
          points: user.points,
          profilePicture: user.profilepicture,
          perks: perks
        };
        req.session.user.password = "";
        req.session.save();
        res.redirect("/square");
      } else {
        throw Error("Incorrect password.");
      }
    }).catch(err => {
      console.log(err);
      res.status(400).render("pages/login", {
        message: "Incorrect password.",
        error: true,
        errorMessage: err,
        pathname: "/login"
      });
    });
  }).catch((err) => {
    console.log(err);
    if (err.message === "No data returned from the query.") {
      // Even though format is deprecated, it still works fine and there is no other better alternative. Refer to https://github.com/nodejs/node/issues/25099
      res.redirect(url.format({
        pathname:"/register",
        query: {
          message: "The username provided does not exist.",
          error: true,
          errorMessage: err
        }
      }));
    } else {
      res.status(500).render("pages/login", {
        message: "There was an error getting the username from database.",
        error: true,
        errorMessage: err,
        pathname: "/login"
      });
    }
  });
};