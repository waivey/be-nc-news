const { updateComment } = require("../models/comments-models.js");

exports.patchComment = (req, res, next) => {
  const { inc_vote } = req.body;
  const { comment_id } = req.params;
  updateComment(comment_id, inc_vote)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch();
};
