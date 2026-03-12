const express = require("express");
const router = express.Router();
const {
  getDevices,
  getDeviceAnalytics,
  getDeviceChart
} = require("../controllers/deviceAnalyticsController");

router.get("/devices", getDevices);
router.get("/:deviceId", getDeviceAnalytics);
router.get("/:deviceId/chart", getDeviceChart);

module.exports = router;