const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
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



app.post("/add-device", (req, res) => {
  const { name, watt } = req.body;
  const id = Date.now().toString();
  devices[id] = {
    id,
    name,
    watt,
    isOn: false,
    startTime: null,
    units: 0
  };

  res.json(devices[id]);
});
app.post("/toggle/:id", (req, res) => {
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

app.get("/devices", (req, res) => {
  res.json(Object.values(devices));
});
setInterval(() => {
  Object.values(devices).forEach(device => {
    if (device.isOn) {
      const hours = (Date.now() - device.startTime) / 3600000;
      device.liveUnits = (device.watt * hours) / 1000;
    }
  });
  io.emit("energy-update", Object.values(devices));
}, 1000);
server.listen(5000, () =>
  console.log(" Wattwise API running on port 5000")
);
