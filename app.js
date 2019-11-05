const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const { handle404s, handle500s } = require("./errors");

app.use("/api", apiRouter);

//error handling
app.all("/*", handle404s);
app.use(handle500s);

module.exports = app;
