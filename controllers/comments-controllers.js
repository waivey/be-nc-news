const {
  updateComment,
  removeComment,
  checkCommentExists
} = require("../models/comments-models.js");

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;

  const { comment_id } = req.params;
  Promise.all([
    updateComment(comment_id, inc_votes),
    checkCommentExists(comment_id)
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
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
