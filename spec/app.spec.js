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
    describe("/topics", () => {
      describe("GET", () => {
        it("status:200 responds with an object with an array of topic objects", () => {
          return request
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an("array");
              expect(topics[0]).to.have.keys("slug", "description");
            });
        });
        it("status:405 responds with method not allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"];
          const promiseArr = invalidMethods.map(method => {
            return request[method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return promiseArr;
        });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
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
          it("status:405 Method Not Allowed", () => {
            const invalidMethods = ["post", "patch", "put", "delete"];
            const promiseArr = invalidMethods.map(method => {
              return request[method]("/api/topics")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return promiseArr;
          });
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
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
          it("status:405 method not allowed", () => {
            const invalidMethods = ["post", "put", "delete"];
            const promiseArr = invalidMethods.map(method => {
              return request[method]("/api/topics")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return promiseArr;
          });
        });
        describe("PATCH", () => {
          it("status:201 responds with an updated article object with votes property having been updated according to the request -> increasing", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(101);
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
          it("status:201 responds with an updated article object with votes property having been updated according to the request -> decreasing", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: -5 })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(95);
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
              .send({ inc_votes: "yes" })
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
            return request[method]("/api/topics")
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
        });
        describe("POST", () => {
          it("status:201 responds with posted comment", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "yes, totally" })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.equal("yes, totally");
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
  });
});
