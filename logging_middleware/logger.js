const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });

const LOG_ENDPOINT = "http://4.224.186.213/evaluation-service/logs";

const stacks = ["backend", "frontend"];
const levels = ["debug", "info", "warn", "error", "fatal"];
const packages = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  "auth", "config", "middleware", "utils",
];

async function Log(stack, level, pkg, message) {
  if (!stacks.includes(stack) || !levels.includes(level) || !packages.includes(pkg)) {
    console.error(`[logger] invalid params => stack:${stack} level:${level} pkg:${pkg}`);
    return;
  }

  try {
    const res = await axios.post(
      LOG_ENDPOINT,
      { stack, level, package: pkg, message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("[logger] failed to send log:", err.message);
  }
}

module.exports = { Log };