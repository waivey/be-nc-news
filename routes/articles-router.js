const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
  postComment,
  getComments,
  getAllArticles
} = require("../controllers/articles-controllers.js");
const { handle405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(handle405s);

module.exports = articlesRouter;
