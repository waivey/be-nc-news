const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const { getEndpoints } = require("../controllers/api-controller");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
