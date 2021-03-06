process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const app = require("../app.js");
const request = require("supertest")(app);
const knex = require("../db/connection");

beforeEach(() => {
  return knex.seed.run();
});

after(() => {
  return knex.destroy();
});

describe("app", () => {
  describe("/path-not-found", () => {
    it("status:404 responds with path not found", () => {
      return request
        .get("/path-not-foun")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Path Not Found");
        });
    });
  });
  describe("/api", () => {
    it("status:405 Method Not Allowed", () => {
      const invalidMethods = ["post", "patch", "put", "delete"];
      const promiseArr = invalidMethods.map(method => {
        return request[method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method Not Allowed");
          });
      });
      return promiseArr;
    });
    describe("GET", () => {
      it("status:200 responds with a JSON of all available endpoints", () => {
        return request
          .get("/api")
          .expect(200)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.an("object");
            expect(msg).to.have.keys(
              "GET /api/topic",
              "GET /api/users/:username",
              "GET /api/articles/:article_id",
              "PATCH /api/articles/:article_id",
              "GET /api/articles/:article_id/comments",
              "POST /api/articles/:article_id/comments",
              "GET /api/articles",
              "PATCH /api/comments/:comment_id",
              "DELETE /api/comments/:comment_id"
            );
          });
      });
    });
    describe("/topics", () => {
      it("status:405 responds with method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const promiseArr = invalidMethods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return promiseArr;
      });
      describe("GET", () => {
        it("status:200 responds with an object with an array of topic objects", () => {
          return request
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an("array");
              expect(topics.length).to.equal(3);
              expect(topics).to.be.sortedBy("description");
              expect(topics[0]).to.have.keys("slug", "description");
            });
        });
      });
      describe("POST", () => {
        it("status:201 responds with new topic object", () => {
          return request
            .post("/api/topics")
            .send({ slug: "test", description: "the importance of testing" })
            .expect(201)
            .then(({ body: { topic } }) => {
              expect(topic).to.have.keys("slug", "description");
            });
        });
        it("status:400 Bad Request if req body does not have slug", () => {
          return request
            .post("/api/topics")
            .send({ description: "the importance of testing" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("status:400 Bad Request if req body does not have description", () => {
          return request
            .post("/api/topics")
            .send({ slug: "bananas" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
    });
    describe("/users", () => {
      it("status:405 Method Not Allowed", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const promiseArr = invalidMethods.map(method => {
          return request[method]("/api/users/butter_bridge")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return promiseArr;
      });
      describe("POST", () => {
        it("status:201 responds with a user object with the properties of username, name, avatar_url", () => {
          return request
            .post("/api/users")
            .send({
              username: "bananas",
              name: "chacita lady",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            })
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys("username", "name", "avatar_url");
            });
        });
        it("status:201 responds with a user object with correct properties even if only sent username", () => {
          return request
            .post("/api/users")
            .send({
              username: "bananas"
            })
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys("username", "name", "avatar_url");
              expect(user.username).to.equal("bananas");
              expect(user.name).to.equal(null);
              expect(user.avatar_url).to.equal(null);
            });
        });
        it("status:400 Bad Request if req body does not contain username value", () => {
          return request
            .post("/api/users")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("status:400 Bad Request if username already exists", () => {
          return request
            .post("/api/users")
            .send({ username: "butter_bridge" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
      describe("GET", () => {
        it("status:200 returns an array of object users", () => {
          return request
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
              expect(users).to.be.an("array");
              expect(users[0]).to.have.keys("username", "name", "avatar_url");
              expect(users.length).to.equal(4);
            });
        });
      });
      describe("/:username", () => {
        it("status:405 Method Not Allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
        describe("GET", () => {
          it("status:200 responds with a user object with properities of username, avatar_url, and name", () => {
            return request
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.have.keys("username", "avatar_url", "name");
              });
          });
          it("status:404 valid but non-existent username", () => {
            return request
              .get("/api/users/waivey")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
        });
      });
    });
    describe("/articles", () => {
      describe("/", () => {
        describe("status:405 Method Not Allowed", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
        describe("GET", () => {
          it("status:200 responds with an articles object", () => {
            return request
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.an("array");
                expect(articles[1]).to.include.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
          });
          it("status:200 array of article objects default sort by date in descending order", () => {
            return request
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy("created_at");
              });
          });
          it("status:200 array of article objects sorted by query in descending order", () => {
            return request
              .get("/api/articles?sort_by=author")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy("author");
              });
          });
          it("status:200 array of article objects sorted by query in chosen order", () => {
            return request
              .get("/api/articles?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.ascendingBy("votes");
              });
          });
          it("status:200 array of article objects filtered by query of author", () => {
            return request
              .get("/api/articles?author=butter_bridge")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles[0].author).to.equal("butter_bridge");
              });
          });
          it("status:200 an empty array when filtered by query of author=lurker", () => {
            return request
              .get("/api/articles?author=lurker")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(0);
              });
          });
          it("status:200 array of article objects filtered by query of topic", () => {
            return request
              .get("/api/articles?topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles[0].topic).to.equal("mitch");
              });
          });
          it("status:200 an empty array when filterd by query of topic=paper", () => {
            return request
              .get("/api/articles?topic=paper")
              .expect(200)
              .then(({ body: { articles, total_count } }) => {
                expect(articles.length).to.equal(0);
                expect(total_count).to.equal(0);
              });
          });
          it("status:200 an array with a default limit of 10 articles", () => {
            return request
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(10);
              });
          });
          it("status:200 an array with a valid chosen limit of articles", () => {
            return request
              .get("/api/articles?limit=6")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(6);
              });
          });
          it("status:200 an array with an invalid chosen limit of articles with default limit set", () => {
            return request
              .get("/api/articles?limit=bananas")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(10);
              });
          });
          it("status:200 an array with p query of page default set to 1", () => {
            return request
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(10);
              });
          });
          it("status:200 an array with p query of page set to 2", () => {
            return request
              .get("/api/articles?p=2")
              .expect(200)
              .then(({ body: { articles, total_count } }) => {
                expect(articles.length).to.equal(2);
                expect(total_count).to.equal(12);
              });
          });
          it("status:200 an array with default p query value of page set to invalid page number", () => {
            return request
              .get("/api/articles?p=bananas")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.equal(10);
              });
          });
          it("status:200 has a total_count property on the return object listing total number of articles discounting the limit", () => {
            return request
              .get("/api/articles")
              .expect(200)
              .then(({ body: { total_count } }) => {
                expect(total_count).to.equal(12);
              });
          });
          it("status:400 error message when sorted by nonexistent column", () => {
            return request
              .get("/api/articles?sort_by=bananas")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:404 error message when filtered by query of non-existent author", () => {
            return request
              .get("/api/articles?author=waivey")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
          it("status:404 error message when filtered by query of non-existent topic", () => {
            return request
              .get("/api/articles?topic=bananas")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
        });
        describe("POST", () => {
          it("status:201 responds with the new article object with the properites author, title, article_id, body, topic, created_at, votes, and comment_count when passed a req object with already existing user and topic", () => {
            return request
              .post("/api/articles")
              .send({
                username: "butter_bridge",
                title: "Why testing matters",
                body: "it just does, so do it",
                topic: "paper"
              })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "body"
                );
              });
          });
          it("status:422 responds Unprocessable Entity for valid but nonexistent topic", () => {
            return request
              .post("/api/articles")
              .send({
                username: "butter_bridge",
                title: "Why testing matters",
                body: "it just does, so do it",
                topic: "bananas"
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Unprocessable Entity");
              });
          });
          it("status:422 responds Unprocessable Entity for valid but nonexistent user", () => {
            return request
              .post("/api/articles")
              .send({
                username: "bananas",
                title: "Why testing matters",
                body: "it just does, so do it",
                topic: "paper"
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Unprocessable Entity");
              });
          });
          it("status:400 responds Bad Request for missing username", () => {
            return request
              .post("/api/articles")
              .send({
                title: "Why testing matters",
                body: "it just does, so do it",
                topic: "paper"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 responds Bad Request for missing body", () => {
            return request
              .post("/api/articles")
              .send({
                username: "butter_bridge",
                title: "Why testing matters",
                topic: "paper"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 responds Bad Request for missing title", () => {
            return request
              .post("/api/articles")
              .send({
                username: "butter_bridge",
                body: "bananas",
                topic: "paper"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 responds Bad Request for missing topic", () => {
            return request
              .post("/api/articles")
              .send({
                username: "butter_bridge",
                body: "bananas",
                title: "bananas"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 responds Bad Request for empty req.body", () => {
            return request
              .post("/api/articles")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
      });
      describe("/:article_id", () => {
        it("status:405 method not allowed", () => {
          const invalidMethods = ["post", "put"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
        describe("GET", () => {
          it("status:200 responds with an article object with properities author, title, article_id, body, topic, created_at, votes, comment_count", () => {
            return request
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
                expect(article.comment_count).to.equal("13");
              });
          });
          it("status:404 valid but non-existent article_id", () => {
            return request
              .get("/api/articles/1234567")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
          it("status:400 Bad Request -> invalid article id", () => {
            return request
              .get("/api/articles/bananas")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
        describe("PATCH", () => {
          it("status:200 responds with an updated article object with votes property having been updated according to the request -> increasing", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(101);
                expect(article.article_id).to.equal(1);
                expect(article).to.have.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                );
              });
          });
          it("status:200 responds with an updated article object with votes property having been updated according to the request -> decreasing", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: -5 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(95);
                expect(article.article_id).to.equal(1);
                expect(article).to.have.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                );
              });
          });
          it("status:200 responds with the article object if patch request is made with an empty object", () => {
            return request
              .patch("/api/articles/1")
              .send({})
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(100);
                expect(article.article_id).to.equal(1);
                expect(article).to.have.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                );
              });
          });
          it("status:400 Bad Request -> invalid article id", () => {
            return request
              .patch("/api/articles/bananas")
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 Bad Request -> invalid input", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: "bananas" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
        describe("DELETE", () => {
          it("status:204 no content in response", () => {
            return request.delete("/api/articles/1").expect(204);
          });
          it("status:404 for valid but nonexistent article id", () => {
            return request
              .delete("/api/articles/1234567")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
          it("status:400 Bad Request for invalid article id", () => {
            return request
              .delete("/api/articles/bananas")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
      });
      describe("/:article_id/comments", () => {
        it("status:405 Method Not Allowed", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/articles/:article_id/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
        describe("GET", () => {
          it("status:200 responds with comments object", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an("array");
                expect(comments[1]).to.have.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
          });
          it("status:200 responds with comments object with default sorting by created_at in descending order", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("created_at");
              });
          });
          it("status:200 responds with comments object sorted by entered query in default order", () => {
            return request
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("author");
              });
          });
          it("status:200 responds with comments object sorted by entered query in custom", () => {
            return request
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.ascendingBy("votes");
              });
          });
          it("status:200 an array with a default limit of 10 comments", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
              });
          });
          it("status:200 an array with a valid chosen limit of comments", () => {
            return request
              .get("/api/articles/1/comments?limit=6")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(6);
              });
          });
          it("status:200 an array with an invalid chosen limit of comments with default limit set", () => {
            return request
              .get("/api/articles/1/comments?limit=bananas")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
              });
          });
          it("status:200 an array with p query of page default set to 1", () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
              });
          });
          it("status:200 an array with p query of page set to 2", () => {
            return request
              .get("/api/articles/1/comments?p=2")
              .expect(200)
              .then(({ body: { comments, total_count } }) => {
                expect(comments.length).to.equal(3);
              });
          });
          it("status:200 an array with default p query value of page set to invalid page number", () => {
            return request
              .get("/api/articles/1/comments?p=bananas")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
              });
          });
          it("status:400 error message when sorted by nonexistent column", () => {
            return request
              .get("/api/articles/1/comments?sort_by=bananas")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:404 Path Not Found for valid but nonexistent article id", () => {
            return request
              .get("/api/articles/123455/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
          it("status:400 Bad Request for invalid article id", () => {
            return request
              .get("/api/articles/bananas/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
        describe("POST", () => {
          it("status:201 responds with posted comment", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "yes, totally" })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.have.keys(
                  "comment_id",
                  "author",
                  "body",
                  "votes",
                  "created_at"
                );
              });
          });
          it("status:422 Unprocessable Entity for invalid request body: username nonexistent", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "waivey", body: "bananas" })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Unprocessable Entity");
              });
          });
          it("status:400 Unprocessable Entity for invalid request body: username not passed", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ body: "bananas" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 Bad Request for invalid request body: body value is empty", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:422 Unprocessable Entity for valid but nonexistent article id", () => {
            return request
              .post("/api/articles/123455/comments")
              .send({ username: "butter_bridge", body: "yes, totally" })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Unprocessable Entity");
              });
          });
          it("status:400 Bad Request for invalid article id", () => {
            return request
              .post("/api/articles/bananas/comments")
              .send({ username: "butter_bridge", body: "yes, totally" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/comments/:comment_id", () => {
        it("status:405 Method Not Allow", () => {
          const invalidMethods = ["get", "post", "put"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/comments/:comment_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
        describe("PATCH", () => {
          it("status:200 responds with the updated comment", () => {
            return request
              .patch("/api/comments/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.have.keys(
                  "comment_id",
                  "created_at",
                  "article_id",
                  "author",
                  "votes",
                  "body"
                );
                expect(comment.comment_id).to.equal(1);
                expect(comment.votes).to.equal(17);
              });
          });
          it("status:200 responds with the comment of requested comment id if patch request made with empty object", () => {
            return request
              .patch("/api/comments/1")
              .send({})
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.have.keys(
                  "comment_id",
                  "created_at",
                  "article_id",
                  "author",
                  "votes",
                  "body"
                );
                expect(comment.comment_id).to.equal(1);
                expect(comment.votes).to.equal(16);
              });
          });
          it("status:404 valid but nonexistent comment_id", () => {
            return request
              .patch("/api/comments/1233456")
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
          it("status:400 Bad Request comment_id", () => {
            return request
              .patch("/api/comments/bananas")
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:400 Bad Request -> invalid input", () => {
            return request
              .patch("/api/comments/1")
              .send({ inc_votes: "bananas" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
        });
        describe("DELETE", () => {
          it("status:204 no content in response", () => {
            return request.delete("/api/comments/1").expect(204);
          });
          it("status:400 Bad Request", () => {
            return request
              .delete("/api/comments/bananas")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("status:404 valid but nonexistent comment id", () => {
            return request
              .delete("/api/comments/1234566")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Path Not Found");
              });
          });
        });
      });
    });
  });
});
