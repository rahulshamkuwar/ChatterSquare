exports.square_get = (req, res) => {
  req.query.session = req.session;
  req.query.pathname = "/square";
  res.status(200).render("pages/square", req.query);
};
