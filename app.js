const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePsql400s
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

//error handling
app.all("/*", handle404s);
app.use(handlePsql400s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
