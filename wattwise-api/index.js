require("dotenv").config(); // MUST BE FIRST
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require("@clerk/express");
const Device = require("./models/Device");
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://wattwise-plum.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use(clerkMiddleware());

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     methods: ["GET", "POST"]
//   },
// });
const io = new Server(server, {
  cors: {
    origin: "https://wattwise-plum.vercel.app",
    methods: ["GET", "POST"]
  },
});

// Store devices per user
let userDevices = {};

app.post("/add-device", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  const { name, watt } = req.body;
  const id = Date.now().toString();

  if (!userDevices[userId]) {
    userDevices[userId] = [];
  }

  const device = {
    id,
    name,
    watt,
    isOn: false,
    startTime: null,
    units: 0,
    liveUnits: 0,
  };

  userDevices[userId].push(device);

  res.json(device);
});

app.post("/toggle/:id", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  const devices = userDevices[userId] || [];

  const device = devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).send("Not found");

  device.isOn = !device.isOn;

  if (device.isOn) {
    device.startTime = Date.now();
  } else {
    const hours = (Date.now() - device.startTime) / 3600000;
    device.units += (device.watt * hours) / 1000;
    device.startTime = null;
    device.liveUnits = 0;
  }

  res.json(device);
});
app.get("/devices", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  res.json(userDevices[userId] || []);
});

//
// Live energy calculation (Socket.IO)
//
setInterval(() => {
  Object.keys(userDevices).forEach((userId) => {
    const devices = userDevices[userId];

    devices.forEach((device) => {
      if (device.isOn && device.startTime) {
        const hours = (Date.now() - device.startTime) / 3600000;
        device.liveUnits = (device.watt * hours) / 1000;
      }
    });

    io.to(userId).emit("energy-update", devices);
  });
}, 1000);
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`⚡ Wattwise API running on port ${PORT}`)
);
app.get("/", (req, res) => {
  res.send("Wattwise API Running 🚀");
});