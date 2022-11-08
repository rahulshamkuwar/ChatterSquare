const db = require("../services/database");

exports.profile_get = async (req, res) => {
  await db.getUser({userId:req.session.user.userId}).then((user) => {
    res.status(200).render("pages/profile", {user: user});
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
