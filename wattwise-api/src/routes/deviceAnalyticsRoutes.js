const express = require("express");
const { getAnalyticsDevices, getDeviceDetail, getChartData } = require("../controllers/deviceAnalyticsController");

const router = express.Router();

router.get("/devices", getAnalyticsDevices);
router.get("/:id", getDeviceDetail);
router.get("/:id/chart", getChartData);

module.exports = router;