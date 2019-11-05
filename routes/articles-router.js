const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes
} = require("../controllers/articles-controllers.js");
const { handle405s } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(handle405s);

module.exports = articlesRouter;
