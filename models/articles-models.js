const knex = require("../db/connection");

exports.fetchArticles = ({
  article_id,
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  return knex("articles")
    .modify(query => {
      if (article_id) query.select("articles.*");
      query.select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      );
    })
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (article_id) query.where("articles.article_id", article_id);
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    });
};

exports.updateVotes = (article_id, newVotes = 0) => {
  const update = newVotes >= 0 ? "increment" : "decrement";
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
