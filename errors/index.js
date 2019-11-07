exports.handlePsql400s = (err, req, res, next) => {
  const codes = ["22P02", "23502"];
  if (codes.includes(err.code)) res.status(400).send({ msg: "Bad Request" });
  else next(err);
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle422s = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code))
    res.status(422).send({ msg: "Unprocessable Entity" });
  else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
