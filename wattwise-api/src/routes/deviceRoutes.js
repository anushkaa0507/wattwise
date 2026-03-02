const express = require("express");
const router = express.Router();

const {
  addDevice,
  toggleDevice,
  getDevices,
} = require("../services/deviceService");

// Create device
router.post("/", async (req, res) => {
  try {
    const { userId, name, watt } = req.body;
    const device = await addDevice(userId, name, watt);
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add device");
  }
});

// Get all devices for a user
router.get("/:userId", async (req, res) => {
  try {
    const devices = await getDevices(req.params.userId);
    res.json(devices);
  } catch (err) {
    res.status(500).send("Failed to fetch devices");
  }
});

// Toggle ON/OFF
router.patch("/:userId/:id", async (req, res) => {
  try {
    const device = await toggleDevice(req.params.userId, req.params.id);
    res.json(device);
  } catch (err) {
    res.status(500).send("Toggle failed");
  }
});

module.exports = router;