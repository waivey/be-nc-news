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
