const usersRouter = require("express").Router();
const {
  getUser,
  postUser,
  getAllUsers
} = require("../controllers/users-controllers.js");
const { handle405s } = require("../errors");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .all(handle405s);

usersRouter
  .route("/:username")
  .get(getUser)
  .all(handle405s);

module.exports = usersRouter;
