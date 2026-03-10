const { getDevicesWithAnalytics, getDeviceAnalytics, getDeviceChartData } = require("../services/deviceAnalyticsService");

/**
 * GET /api/device-analytics/devices - List devices with analytics
 */
const getAnalyticsDevices = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const devices = await getDevicesWithAnalytics(userId);
    res.json(devices);
  } catch (error) {
    console.error("Error fetching analytics devices:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

/**
 * GET /api/device-analytics/:id - Detailed analytics for device
 */
const getDeviceDetail = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const analytics = await getDeviceAnalytics(userId, id);
    if (!analytics) return res.status(404).json({ error: "Device not found" });
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching device analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

/**
 * GET /api/device-analytics/:id/chart?minutes=60 - Chart data
 */
const getChartData = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const minutes = parseInt(req.query.minutes) || 60;
    const data = await getDeviceChartData(userId, id, minutes);
    res.json({ data });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};

module.exports = {
  getAnalyticsDevices,
  getDeviceDetail,
  getChartData,
};