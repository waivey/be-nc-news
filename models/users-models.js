const knex = require("../db/connection");

exports.fetchUser = username => {
  return knex
    .select("*")
    .from("users")
    .where("username", username)
    .then(([user]) => {
      return !user
        ? Promise.reject({ status: 404, msg: "Path Not Found" })
        : user;
    });
};
