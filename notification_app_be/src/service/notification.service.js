const axios = require("axios");
const { ACCESS_TOKEN, NOTIF_API_URL } = require("../config/env");
const { Log } = require("../../../logging_middleware/logger");

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

async function fetchAllNotifications() {
  await Log(
    "backend", "info", "service",
    "Fetching all notifications from evaluation API"
  );

  const response = await axios.get(NOTIF_API_URL, { headers: HEADERS });

  await Log(
    "backend", "info", "service",
    `Successfully fetched ${response.data.notifications.length} notifications`
  );

  return response.data.notifications;
}

module.exports = { fetchAllNotifications };