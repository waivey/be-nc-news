process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
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
  });
});