const {
  updateComment,
  removeComment
} = require("../models/comments-models.js");

exports.patchComment = (req, res, next) => {
  const { inc_vote } = req.body;
  const { comment_id } = req.params;
  updateComment(comment_id, inc_vote)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
