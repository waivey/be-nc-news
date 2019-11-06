const { updateComment } = require("../models/comments-models.js");

exports.patchComment = (req, res, next) => {
  updateComment();
};
