require("dotenv").config(); // MUST BE FIRST

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require("@clerk/express");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Clerk added here
app.use(clerkMiddleware());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let devices = {};

/*
device structure:
{
  id: {
    name: "Fan",
    watt: 75,
    isOn: true,
    startTime: Date,
    units: 0
  }
}
*/

//
// ✅ ALL ROUTES MUST NOW BE PROTECTED WITH requireAuth()
//

// Add device
app.post("/add-device", requireAuth(), (req, res) => {
  const { name, watt } = req.body;
  const id = Date.now().toString();

  devices[id] = {
    id,
    name,
    watt,
    isOn: false,
    startTime: null,
    units: 0,
  };

  res.json(devices[id]);
});

// Toggle device
app.post("/toggle/:id", requireAuth(), (req, res) => {
  const device = devices[req.params.id];
  if (!device) return res.status(404).send("Not found");

  device.isOn = !device.isOn;

  if (device.isOn) {
    device.startTime = Date.now();
  } else {
    const hours = (Date.now() - device.startTime) / 3600000;
    device.units += (device.watt * hours) / 1000;
  }

  res.json(device);
});

// Get devices
app.get("/devices", requireAuth(), (req, res) => {
  res.json(Object.values(devices));
});

//
// Live energy calculation (Socket.IO)
//
setInterval(() => {
  Object.values(devices).forEach((device) => {
    if (device.isOn) {
      const hours = (Date.now() - device.startTime) / 3600000;
      device.liveUnits = (device.watt * hours) / 1000;
    }
  });

  io.emit("energy-update", Object.values(devices));
}, 1000);

server.listen(process.env.PORT || 5000, () =>
  console.log("⚡ Wattwise API running on port 5000")
);