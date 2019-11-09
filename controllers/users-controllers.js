const {
  fetchUser,
  addUser,
  fetchAllUsers
} = require("../models/users-models.js");

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
