const logMiddleware = (req, res, next) => {
  console.log(`LOG: ${req.method} ${req.url}`);
  next();
};

module.exports = logMiddleware;
