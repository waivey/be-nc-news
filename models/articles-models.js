const knex = require("../db/connection");

exports.fetchArticle = article_id => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .returning("*")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Path Not Found" });
      } else {
        const commentCount = knex("comments")
          .count("article_id")
          .where("article_id", article_id);
        return Promise.all([article, commentCount]);
      }
    })
    .then(response => {
      const obj = response[0];
      obj.comment_count = response[1][0].count;
      return obj;
    });
};

exports.updateVotes = (article_id, newVotes) => {
  return knex
    .select("votes")
    .from("articles")
    .where("article_id", article_id)
    .then(([vote]) => {
      const value = vote.votes;
      console.log((vote.votes = value + newVotes));
      console.log(vote, "<<obj??");
      return (vote.votes = value + newVotes);
    })
    .then(updatedVote => {
      return knex("articles")
        .where("article_id", article_id)
        .update("votes", updatedVote);
    });
};
