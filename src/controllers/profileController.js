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
