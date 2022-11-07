exports.square_get = (req, res) => {
  res.status(200).render("pages/square", req.query);
};