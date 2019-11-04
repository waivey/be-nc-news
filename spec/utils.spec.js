const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes an array of objects and returns an array", () => {
    const list = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(formatDates(list)).to.be.an("array");
  });
  it("returns an array with an object with a key/value pair of created_at and formated date when passed an array with an object containing a key/value pair of created_at and unix timestamp", () => {
    const list = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = formatDates(list);
    expect(output[0]).to.have.keys(
      "body",
      "belongs_to",
      "created_at",
      "votes",
      "created_by"
    );
    expect(output[0].created_at).instanceOf(Date);
  });
  it("returns an array of objects with key/value pairs of created_at updated to timestamp format", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const output = formatDates(input);
    expect(output[1]).to.have.keys(
      "body",
      "belongs_to",
      "created_at",
      "votes",
      "created_by"
    );
  });
  it("does not mutate origina array", () => {
    const list = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = formatDates(list);
    expect(list).to.not.equal(output);
    expect(list).to.deep.equal([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
