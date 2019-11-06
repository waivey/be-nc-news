const knex = require("../db/connection");

exports.fetchArticles = (article_id, order_by, direction) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      !direction ? (direction = "desc") : direction;
      console.log(direction);
      if (order_by) query.orderBy(order_by, direction);
      else query.orderBy("created_at", direction);
    })
    .modify(query => {
      if (article_id) query.where("articles.article_id", article_id);
    })
    .then(result => {
      return result.length === 0
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : result;
    })
    .then(result => {
      if (!article_id) {
        return result.map(article => {
          delete article.body;
          return { ...article };
        });
      } else {
        return result;
      }
    });
};

exports.updateVotes = (article_id, newVotes) => {
  const update = newVotes > 0 ? "increment" : "decrement";
  return knex("articles")
    .where("article_id", article_id)
    [update]("votes", Math.abs(newVotes))
    .then(() => {
      return knex
        .select("*")
        .from("articles")
        .where("article_id", article_id);
    });
};

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
    })
    .then(comments => {
      return comments.length === 0
        ? Promise.reject({ status: 422, msg: "Unprocessable Entity" })
        : comments;
    });
};
