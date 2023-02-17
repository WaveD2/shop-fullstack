const notFound = async (req, res, next) => {
  const err = new Error(`Router ${req.originalUrl} not found !`);
  res.status(404);
  next(err);
};

const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    ms: err?.message,
  });
};

module.exports = {
  errHandler,
  notFound,
};
