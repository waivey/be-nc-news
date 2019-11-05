const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics-controllers.js");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
