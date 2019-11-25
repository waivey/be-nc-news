const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/api-router.js");
const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePsql400s,
  handle422s
} = require("./errors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

//error handling
app.all("/*", handle404s);
app.use(handlePsql400s);
app.use(handle422s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
