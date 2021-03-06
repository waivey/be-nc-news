const {
  fetchArticles,
  updateVotes,
  checkArticlesExists,
  fetchArticleCount,
  addArticle,
  removeArticle
} = require("../models/articles-models.js");
const { addComment, fetchComments } = require("../models/comments-models");
const { fetchUser } = require("../models/users-models");
const { fetchAllTopics, checkTopicExists } = require("../models/topics-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchArticles({ article_id }), checkArticlesExists(article_id)])

    .then(([[article]]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  body.article_id = article_id;
  Promise.all([addComment(body), fetchUser(body.username)])

    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchComments({ article_id, ...req.query }),
    checkArticlesExists(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  Promise.all([
    fetchArticles({ ...req.query }),
    fetchArticleCount({ ...req.query }),
    fetchAllTopics(req.query.topic),
    fetchUser(req.query.author),
    checkTopicExists(req.query.topic)
  ])
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  Promise.all([
    addArticle(req.body),
    fetchUser(req.body.username),
    checkTopicExists(req.body.topic)
  ])
    .then(([article, user, topic]) => {
      //console.log(article);
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
