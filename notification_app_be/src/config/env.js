require("dotenv").config({ path: __dirname + "/../../.env" });

module.exports = {
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  NOTIF_API_URL: "http://4.224.186.213/evaluation-service/notifications",
};