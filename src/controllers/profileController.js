const db = require("../services/database");

exports.profile_get = async (req, res) => {
  await db.getUser({userId:req.session.user.userId}).then((user) => {
    req.query.user = user;
    req.query.user.password = "";
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
        errorMessage: err
      }
    }));
  });
};

exports.profile_post_change_password = async (req, res) => {
  const { password } = req.body;
  const newHashedPassword = await bcrypt.hash(password, 10);

  await db.getUser({userId: req.session.user.userId}).then((user) => {
    const { password: oldHashedPassword } = user;
    bcrypt.compare(password, oldHashedPassword).then((result) => {
      if (result) {
        
        db.updateUser({userId: req.session.user.userId, password: newHashedPassword}).then(() => {
          res.status(400).render("pages/profile", {
            message: "Account successfully created.",
            pathname: "/profile"
          });
        }).catch((err) => {
          console.log(err);
          res.status(500).render("pages/profile", {
            message: "There was an error inserting to database.",
            error: true,
            errorMessage: err,
            pathname: "/profile"
          });
        });
      } else {
        throw Error("Incorrect password.");
      }
    }).catch(err => {
      console.log(err);
      res.status(400).render("pages/profile", {
        message: "Incorrect password.",
        error: true,
        errorMessage: err,
        pathname: "/profile"
      });
    });
  }).catch((err) => {
    console.log(err);
    if (err.message === "No data returned from the query.") {
      res.status(400).render("pages/profile", {
        message: "Incorrect password.",
        error: true,
        errorMessage: err,
        pathname: "/profile"
      });
    } else {
      res.status(500).render("pages/profile", {
        message: "There was an error getting the user from database.",
        error: true,
        errorMessage: err,
        pathname: "/profile"
      });
    }
  });
};
