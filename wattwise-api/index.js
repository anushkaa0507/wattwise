require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const deviceRoutes = require("./src/routes/deviceRoutes");
const pool = require("./src/config/db");

const app = express();
const server = http.createServer(app);

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/devices", deviceRoutes);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to frontend URL
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* 🔑 export io */
module.exports.io = io;

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000;

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("✅ Connected to Supabase PostgreSQL");
    server.listen(PORT, () => {
      console.log(`⚡ Wattwise API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });