const url = require('url');

exports.logout_get = (req, res) => {
  req.session.destroy();
  res.redirect(url.format({
    pathname:"/login",
    query: {
      message: "Logged out successfully.",
      error: false,
      errorMessage: ""
    }
  }));
};