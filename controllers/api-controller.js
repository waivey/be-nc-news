exports.getEndpoints = (req, res, next) => {
  res.status(200).send({
    msg: {
      "GET /api/topic":
        "responds to a GET request with an array of topic objects, each with the properties of slug and description",
      "GET /api/users/:username":
        "responds to a GET request for a given existing username with a user object with the properties of username, avatar_url, and name",
      "GET /api/articles/:article_id":
        "responds to a GET request for a given existing article id with an object with the properties of author(as username), title, article id, body, topic, created at, votes, and comment count",
      "PATCH /api/articles/:article_id":
        "when passed an object of inc votes with an integer for the given article id, updates that article's votes and responds with the updated article object",
      "GET /api/articles/:article_id/comments":
        "responds with an array of comments for the given article id with the comment objects having the properties of comment id, votes, created at, author (as username), and body; this endpoint also accepts queries to sort and order the response, which defaults to sorting by time created in descending order",
      "POST /api/articles/:article_id/comments":
        "the request body should contain an object with username and body properties, and will respond with the posted comment object with the properties of comment id, votes, created at, author (as username), and body",
      "GET /api/articles":
        "responds with an array of article objects with the properties of author (as username), title, article id, topic, created at, votes, and comment count; default sorting is by date in descending order, but will accept queries to change that, as well as queries to filter articles by topic and author",
      "PATCH /api/comments/:comment_id":
        "accepts a request body  with the property inc votes and a integer value for the given comment id and increments the comment's votes property accordingly; responds with the updated comment",
      "DELETE /api/comments/:comment_id":
        "deletes the given comment and responds with status code 204 and no content"
    }
  });
};
