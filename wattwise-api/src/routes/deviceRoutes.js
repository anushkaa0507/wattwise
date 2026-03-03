
const express = require("express");
const router = express.Router();
const service = require("../services/deviceService");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const devices = await service.getDevices(userId);
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch devices" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { name, watt } = req.body;
    if (!name || !watt) return res.status(400).json({ error: "Missing fields" });
    const device = await service.addDevice(userId, name, Number(watt));
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add device" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const device = await service.toggleDevice(userId, req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Toggle failed" });
  }
});

module.exports = router;