const knex = require("../db/connection");

exports.addComment = commentObj => {
  const value = commentObj.username;
  commentObj.author = value;
  delete commentObj.username;
  return knex("comments")
    .insert(commentObj)
    .returning("*")
    .then(([newCommentObj]) => {
      return newCommentObj.body;
    });
};

exports.fetchComments = (article_id, order_by, direction) => {
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .modify(query => {
      !direction ? (direction = "desc") : direction;
      if (order_by) query.orderBy(order_by, direction);
      else query.orderBy("created_at", direction);
    });
  // .then(comments => {
  //   return comments.length === 0
  //     ? Promise.reject()
  //     : comments;
  // });
};

exports.updateComment = (comment_id, newVotes) => {
  const update = newVotes > 0 ? "increment" : "decrement";
  return knex("comments")
    .where("comment_id", comment_id)
    [update]("votes", Math.abs(newVotes))
    .then(() => {
      return knex
        .select("*")
        .from("comments")
        .where("comment_id", comment_id);
    })
    .then(([updatedComment]) => {
      return !updatedComment
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : updatedComment;
    });
};

exports.removeComment = comment_id => {
  return knex("comments")
    .where("comment_id", comment_id)
    .del()
    .then(delCount => {
      return delCount === 0
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : delCount;
    });
};
