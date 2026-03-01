const express = require("express");
const router = express.Router();
const controller = require("../controllers/deviceController");

router.get("/", controller.getDevices);
router.post("/", controller.addDevice);
router.patch("/:id", controller.toggleDevice);

module.exports = router;