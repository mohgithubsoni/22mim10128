const express = require("express");
const cors = require("cors");
const { Log } = require("../logging_middleware/logger");
const { PORT } = require("./src/config/env");
const requestLogger = require("./src/middleware/requestLogger");
const notificationRoutes = require("./src/routes/notification.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/notifications", notificationRoutes);

app.get("/health", async (req, res) => {
  await Log("backend", "info", "route", "health check hit");
  return res.status(200).json({ status: "ok" });
});

app.use(async (req, res) => {
  await Log("backend", "warn", "route", `404 - ${req.method} ${req.originalUrl}`);
  return res.status(404).json({ error: "route not found" });
});

app.use(async (err, req, res, next) => {
  await Log("backend", "fatal", "middleware", `unhandled error: ${err.message}`);
  return res.status(500).json({ error: "something broke on the server" });
});

app.listen(PORT, async () => {
  await Log("backend", "info", "service", `server started on port ${PORT}`);
  console.log(`server running at http://localhost:${PORT}`);
});