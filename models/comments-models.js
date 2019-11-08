const knex = require("../db/connection");

exports.addComment = commentObj => {
  const value = commentObj.username;
  commentObj.author = value;
  return knex("comments")
    .insert({
      author: commentObj.author,
      body: commentObj.body,
      article_id: commentObj.article_id
    })
    .returning("*")
    .then(([newCommentObj]) => {
      const updatedComment = ({ article_id, ...rest }) => rest;
      return updatedComment(newCommentObj);
    });
};

exports.fetchComments = (article_id, order_by, direction = "desc") => {
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .modify(query => {
      if (order_by) query.orderBy(order_by, direction);
      else query.orderBy("created_at", direction);
    });
};

exports.updateComment = (comment_id, newVotes = 0) => {
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
      return updatedComment;
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

exports.checkCommentExists = comment_id => {
  return knex
    .select("*")
    .from("comments")
    .modify(query => {
      if (comment_id) query.where("comment_id", comment_id);
    })
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, msg: "Path Not Found" });
    });
};
