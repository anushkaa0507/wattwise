// src/controllers/deviceAnalyticsController.js
const { getDevicesWithAnalytics, getDeviceAnalytics, getDeviceChartData } = require("../services/deviceAnalyticsService");

const getAnalyticsDevices = async (req, res) => {
  try {
    const userId = req.auth.userId; 
    const devices = await getDevicesWithAnalytics(userId);
    res.json(devices);
  } catch (error) {
    console.error("Error fetching analytics devices:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

const getDeviceDetail = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const analytics = await getDeviceAnalytics(userId, id);
    if (!analytics) return res.status(404).json({ error: "Device not found" });
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching device analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

const getChartData = async (req, res) => {
  try {
    const userId = req.auth.userId;
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