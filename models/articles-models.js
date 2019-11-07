const knex = require("../db/connection");

exports.fetchArticles = (article_id, req_query) => {
  let order_by;
  let direction;
  let username;
  let topic;
  if (req_query) {
    order_by = req_query.sort_by;
    direction = req_query.order;
    username = req_query.author;
    topic = req_query.topic;
  }
  return (
    knex
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .modify(query => {
        !direction ? (direction = "desc") : direction;
        if (order_by) query.orderBy(order_by, direction);
        else query.orderBy("created_at", direction);
      })
      .modify(query => {
        if (article_id) query.where("articles.article_id", article_id);
      })
      .modify(query => {
        if (username) query.where("articles.author", username);
      })
      .modify(query => {
        if (topic) query.where("articles.topic", topic);
      })
      // .then(result => {
      //   return result.length === 0
      //     ? Promise.reject({ status: 404, msg: "Path Not Found" })
      //     : result;
      // })
      .then(result => {
        if (!article_id) {
          return result.map(article => {
            delete article.body;
            return { ...article };
          });
        } else {
          return result;
        }
      })
  );
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

exports.checkArticlesExists = article_id => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Path Not Found" });
    });
};
