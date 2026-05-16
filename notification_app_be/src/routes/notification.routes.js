const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getPriorityInbox,
} = require("../controller/notification.controller");

router.get("/", getAllNotifications);
router.get("/priority", getPriorityInbox);

module.exports = router;