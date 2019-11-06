const commentsRouter = require("express").Router();
const { patchComment } = require("../controllers/comments-controllers.js");
const { handle405s } = require("../errors");

commentsRouter.route("/:comment_id").patch(patchComment);

module.exports = commentsRouter;
