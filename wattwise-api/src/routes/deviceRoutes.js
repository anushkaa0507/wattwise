const express = require("express");
const router = express.Router();
const controller = require("../controllers/deviceController");

router.post("/add-device", controller.addDevice);
router.post("/toggle/:id", controller.toggleDevice);
router.get("/devices", controller.getDevices);

module.exports = router;
