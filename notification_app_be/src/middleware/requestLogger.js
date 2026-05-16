const { Log } = require("../.././../logging_middleware/logger");

async function requestLogger(req, res, next) {
  await Log(
    "backend",
    "info",
    "middleware",
    `Incoming request: ${req.method} ${req.originalUrl}`
  );
  next();
}

module.exports = requestLogger;