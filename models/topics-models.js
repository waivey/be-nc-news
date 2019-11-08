const knex = require("../db/connection");

exports.fetchAllTopics = topic => {
  return knex
    .select("*")
    .from("topics")
    .modify(query => {
      if (topic) query.where("slug", topic);
    })
    .orderBy("description")
    .then(topics => {
      return topics;
    });
};

exports.checkTopicExists = topic => {
  return knex
    .select("*")
    .from("topics")
    .modify(query => {
      if (topic) query.where("slug", topic);
    })
    .then(([topic]) => {
      if (!topic) return Promise.reject({ status: 404, msg: "Path Not Found" });
    });
};
