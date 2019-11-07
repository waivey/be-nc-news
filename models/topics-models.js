const knex = require("../db/connection");

exports.fetchAllTopics = topic => {
  return knex
    .select("*")
    .from("topics")
    .modify(query => {
      if (topic) query.where("slug", topic);
    })
    .then(([topic]) => {
      return !topic
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : [topic];
    });
};
