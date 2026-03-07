const express = require("express");
const router = express.Router();
const { getDeviceAnalytics } = require("../controllers/deviceAnalyticsController");
const { requireAuth } = require("@clerk/express");

router.get("/", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;

    const data = await getDeviceAnalytics(userId);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;