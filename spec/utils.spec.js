const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
  renameKeys
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes an array of objects and returns an array", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(list)).to.be.an("array");
  });
  it("returns an array with an object with a key/value pair of created_at and formated date when passed an array with an object containing a key/value pair of created_at and unix timestamp", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(list);
    expect(output[0]).to.include.key("created_at");
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
    expect(output[1]).to.include.key("created_at");
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

describe("makeRefObj", () => {
  it("takes an array with an object, and returns a new object", () => {
    const input = [
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    expect(makeRefObj(input)).to.be.an("object");
  });
  it("takes an array with an object, and returns an object with key/value pair of article_id:title", () => {
    const input = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    expect(makeRefObj(input)).to.deep.equal({
      1: "They're not exactly dogs, are they?"
    });
  });
  it("takes an array with multiple objects, and returns an object with key/value pairs of article_id:title", () => {
    const input = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      },
      {
        article_id: 2,
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      },
      {
        article_id: 3,
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      }
    ];
    expect(makeRefObj(input)).to.deep.equal({
      1: "They're not exactly dogs, are they?",
      2: "Seven inspirational thought leaders from Manchester UK",
      3: "Am I a cat?"
    });
  });
  it("does not mutate original array", () => {
    const input = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    const output = makeRefObj(input);
    expect(input).to.not.equal(output);
    expect(input).to.deep.equal([
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ]);
  });
});

describe("formatComments", () => {
  it("takes an array with an object and a reference object, and returns a new array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj = { 1: "They're not exactly dogs, are they?" };
    expect(formatComments(input, refObj)).to.be.an("array");
  });
  it("takes an array with an object and a reference object, and returns a new array with a well-formatted object", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj = { 1: "They're not exactly dogs, are they?" };
    const output = formatComments(input, refObj);
    expect(output[0]).to.include.keys("author", "article_id", "created_at");
  });
});

describe("renameKeys", () => {
  it("takes an array with an object, and two string parameters, and returns a new array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(renameKeys(input, "belongs_to", "article_id")).to.be.an("array");
  });
  it("takes an array with an object, and two strings params, and returns a new array with key name updated", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = renameKeys(input, "belongs_to", "article_id");
    expect(output[0]).to.have.keys(
      "body",
      "created_by",
      "article_id",
      "votes",
      "created_at"
    );
  });
  it("does not mutate original array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = renameKeys(input, "belongs_to", "article_id");
    expect(input).to.not.equal(output);
    expect(input).to.deep.equal([
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
