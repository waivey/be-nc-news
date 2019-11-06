const knex = require("../db/connection");

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
    });
};
