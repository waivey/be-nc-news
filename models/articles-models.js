const knex = require("../db/connection");

exports.fetchArticle = article_id => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(([result]) => {
      return !result
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : result;
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
  // .then(([vote]) => {
  //   const value = vote.votes;
  //   console.log((vote.votes = value + newVotes));
  //   console.log(vote, "<<obj??");
  //   return (vote.votes = value + newVotes);
  // })
  // .then(updatedVote => {
  //   return knex("articles")
  //     .where("article_id", article_id)
  //     .update("votes", updatedVote);
  // });
};
