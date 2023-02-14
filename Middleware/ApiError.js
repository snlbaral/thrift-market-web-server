function ApiError(res, code, message = "Something went wrong.", error = {}) {
  if (
    error?.code === 11000 &&
    (error?.name === "MongoError" || error?.name === "MongoServerError")
  ) {
    return res.status(400).send({
      status: 400,
      message: `${Object.keys(error.keyValue)[0]} is already in use.`,
    });
  }
  return res.status(code).send({
    status: code,
    message,
  });
}

module.exports = ApiError;
