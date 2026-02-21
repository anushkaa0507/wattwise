const express = require("express");
const {
  getDevices,
  addDevice,
  toggleDevice,
} = require("../controllers/deviceController");

const router = express.Router();
const controller = require("../controllers/deviceController");
const authMiddleware = require("../utils/authMiddleware");

router.get("/devices", authMiddleware, getDevices);
router.post("/add-device", authMiddleware, addDevice);
router.post("/toggle/:id", authMiddleware, toggleDevice);

module.exports = router;
