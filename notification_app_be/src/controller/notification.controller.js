const { fetchAllNotifications } = require("../service/notification.service");
const { getTopNByPriority } = require("../utils/priorityInbox");
const { Log } = require("../../../logging_middleware/logger");

async function getAllNotifications(req, res) {
  await Log("backend", "info", "controller", "getAllNotifications controller invoked");

  try {
    const notifications = await fetchAllNotifications();

    await Log(
      "backend", "info", "controller",
      `Returning ${notifications.length} notifications to client`
    );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications,
    });
  } catch (err) {
    await Log(
      "backend", "error", "controller",
      `getAllNotifications failed: ${err.message}`
    );
    return res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
    });
  }
}

async function getPriorityInbox(req, res) {
  const n = parseInt(req.query.n) || 10;

  await Log(
    "backend", "info", "controller",
    `getPriorityInbox controller invoked with n=${n}`
  );

  try {
    const notifications = await fetchAllNotifications();
    const top = await getTopNByPriority(notifications, n);

    await Log(
      "backend", "info", "controller",
      `Returning top ${top.length} priority notifications to client`
    );

    return res.status(200).json({
      success: true,
      count: top.length,
      notifications: top,
    });
  } catch (err) {
    await Log(
      "backend", "error", "controller",
      `getPriorityInbox failed: ${err.message}`
    );
    return res.status(500).json({
      success: false,
      error: "Failed to compute priority inbox",
    });
  }
}

module.exports = { getAllNotifications, getPriorityInbox };