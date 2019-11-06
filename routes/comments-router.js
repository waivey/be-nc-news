const commentsRouter = require("express").Router();
const { patchCommment } = require("../controllers/comments-controllers.js");
const { handle405s } = require("../errors");

commentsRouther.route("/:comment_id").patch(patchComment);

module.exports = commentsRouter;
