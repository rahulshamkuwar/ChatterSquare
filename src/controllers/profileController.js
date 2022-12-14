const db = require("../services/database");
const bcrypt = require("bcrypt");
const url = require('url');
const QueryResultError = require("pg-promise").errors.QueryResultError;
const qrec = require("pg-promise").errors.queryResultErrorCode;

exports.profile_get = async (req, res) => {
  await db.getUser({userId:req.session.user.userId}).then(async (user) => {
    const perks = await db.getPerks({userId: user.userid});
    req.session.user = {
      userId: user.userid,
      username: user.username,
      isAdmin: user.isadmin,
      points: user.points,
      profilePicture: user.profilepicture,
      perks: {
        font: perks.font,
        borderType: perks.bordertype,
        borderColor: perks.bordercolor,
        profilePicture: perks.profilepicture,
        nameColor: perks.namecolor
      }
    };
    req.query.session = req.session;
    req.query.pathname = "/profile";
    res.status(200).render("pages/profile", req.query);
  }).catch((err) => {
    console.log(err);
    res.redirect(url.format({
      pathname:"/",
      query: {
        message: "There was an error getting the username from database.",
        error: true,
        errorMessage: err,
        session: req.session
      }
    }));
  });
};

exports.profile_post_change_password = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  await db.getUser({userId: req.session.user.userId}).then((user) => {
    const { password: oldHashedPassword } = user;
    bcrypt.compare(oldPassword, oldHashedPassword).then((result) => {
      if (result) {
        db.updateUser({userId: req.session.user.userId, password: newHashedPassword}).then((user) => {
          req.session.user = {
            userId: user.userid,
            username: user.username,
            isAdmin: user.isadmin,
            points: user.points,
            profilePicture: user.profilepicture
          };
          res.redirect(url.format({
            pathname:"/profile",
            query: {
              message: "Password successfully changed.",
              pathname: "/profile",
              session: req.session
            }
          }));
        }).catch((err) => {
          console.log(err);
          res.redirect(url.format({
            pathname:"/profile",
            query: {
              message: "There was an error inserting to database.",
              error: true,
              errorMessage: err,
              pathname: "/profile"
            }
          }));
        });
      } else {
        throw Error("Incorrect password.");
      }
    }).catch(err => {
      console.log(err);
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "Incorrect password.",
          error: true,
          errorMessage: err,
          pathname: "/profile",
          session: req.session
        }
      }));
    });
  }).catch((err) => {
    console.log(err);
    if (err instanceof QueryResultError && err.code === qrec.noData) {
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "Incorrect password.",
          error: true,
          errorMessage: err,
          pathname: "/profile",
          session: req.session
        }
      }));
    } else {
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "There was an error getting the user from database.",
          error: true,
          errorMessage: err,
          pathname: "/profile",
          session: req.session
        }
      }));
    }
  });
};

exports.profile_post_change_username = async (req, res) => {
  const { newUsername } = req.body;
  db.updateUser({userId: req.session.user.userId, username: newUsername}).then((user) => {
    req.session.user = {
      userId: user.userid,
      username: user.username,
      isAdmin: user.isadmin,
      points: user.points,
      profilePicture: user.profilepicture
    };
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "Username successfully changed.",
        pathname: "/profile",
        session: req.session
      }
    }));
  }).catch((err) => {
    console.log(err);
    if (err.constraint === "users_username_key") {
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "This user already exists, please use a new username.",
          error: true,
          errorMessage: err,
          pathname: "/profile"
        }
      }));
    } else {
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "There was an error inserting to database.",
          error: true,
          errorMessage: err,
          pathname: "/profile"
        }
      }));
    }
  });
};

exports.profile_post_change_profile_picture = async (req, res) => {
  const { profilePicture }  = req.body;
  const check = profilePicture.split(";")[0].split("/");
  const ext = check[check.length - 1];
  if (profilePicture === "") {
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "The input file is not valid.",
        error: true,
        pathname: "/profile"
      }
    }));
    return;
  }
  if (ext.toLowerCase() === "gif" && !req.session.user.perks.profilePicture) {
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "You have not purchased the Animated Profile Picture perk.",
        error: true,
        pathname: "/profile"
      }
    }));
    return;
  }
  const user = await db.updateUser({userId: req.session.user.userId, profilePicture: profilePicture}).catch((err) => {
    console.log(err);
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "There was an error updating profile picture.",
        error: true,
        errorMessage: err,
        pathname: "/profile"
      }
    }));
  });
  req.session.user = {
    userId: user.userid,
    username: user.username,
    isAdmin: user.isadmin,
    points: user.points,
    profilePicture: user.profilepicture
  };
  res.redirect(url.format({
    pathname:"/profile",
    query: {
      message: "Successfully changed profile picture",
      pathname: "/profile",
      session: req.session
    }
  }));
};

exports.profile_post_update_perks = async (req, res) => {
  const { font, borderType, borderColor, profilePicture, nameColor, subtractPoints }  = req.body;
  if (subtractPoints === "true" && req.session.user.points < 100) {
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "You do not have enough points.",
        error: true,
        pathname: "/profile"
      }
    }));
    return;
  }

  const perks = await db.updatePerks({userId: req.session.user.userId, font: font, borderType: borderType, borderColor: borderColor, profilePicture: profilePicture, nameColor: nameColor }).catch((err) => {
    console.log(err);
    res.redirect(url.format({
      pathname:"/profile",
      query: {
        message: "There was an error buying perk.",
        error: true,
        errorMessage: err,
        pathname: "/profile"
      }
    }));
  });
  if (subtractPoints === "true") {
    const user = await db.updateUser({userId: req.session.user.userId, points: -100}).catch((err) => {
      console.log(err);
      res.redirect(url.format({
        pathname:"/profile",
        query: {
          message: "There was an error buying perk.",
          error: true,
          errorMessage: err,
          pathname: "/profile"
        }
      }));
      return;
    });
    req.session.user = {
      userId: user.userid,
      username: user.username,
      isAdmin: user.isadmin,
      points: user.points,
      profilePicture: user.profilepicture,
    };
  }
  req.session.user.perks = {
    font: perks.font,
    borderType: perks.bordertype,
    borderColor: perks.bordercolor,
    profilePicture: perks.profilepicture,
    nameColor: perks.namecolor
  };
  res.redirect(url.format({
    pathname:"/profile",
    query: {
      message: "Successfully purchased perk.",
      pathname: "/profile",
      session: req.session
    }
  }));
};