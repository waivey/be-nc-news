const usersRouter = require("express").Router();
const { getUser } = require("../controllers/users-controllers.js");

usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
