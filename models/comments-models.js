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

exports.fetchComments = ({
  article_id,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
}) => {
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .modify(query => {
      let limitNum = parseInt(limit);
      let page = parseInt(p);
      if (Number.isNaN(page)) page = 1;
      if (Number.isNaN(limitNum)) {
        query.limit(10).offset(page * 10 - 10);
      } else {
        query.limit(limitNum).offset(page * limitNum - limitNum);
      }
    });
};

exports.updateComment = (comment_id, newVotes = 0) => {
  const update = newVotes > 0 ? "increment" : "decrement";
  return knex("comments")
    .where("comment_id", comment_id)
    [update]("votes", Math.abs(newVotes))
    .returning("*")
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
