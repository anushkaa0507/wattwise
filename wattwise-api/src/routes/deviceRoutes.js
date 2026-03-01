const express = require("express");
const { requireAuth } = require("@clerk/express");
const {
  getDevices,
  addDevice,
  toggleDevice,
} = require("../services/deviceService");

const router = express.Router();

router.use(requireAuth());

router.get("/", (req, res) => {
  try {
    const userId = req.auth.userId;
    const devices = getDevices(userId);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name, watt } = req.body;

    const device = addDevice(userId, name, watt);
    res.json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/toggle", (req, res) => {
  try {
    const userId = req.auth.userId;
    const device = toggleDevice(userId, req.params.id);
    res.json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;