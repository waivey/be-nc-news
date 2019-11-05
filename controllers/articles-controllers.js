const { fetchArticle } = require("../models/articles-models.js");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.body;
  fetchArticle(article_id)
    .then(res.status(200).send({ article }))
    .catch(next);
};
