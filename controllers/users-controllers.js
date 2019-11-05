const { fetchUser } = require("../models/users-models.js");

exports.getUser = (req, res, next) => {
  fetchUser();
};
