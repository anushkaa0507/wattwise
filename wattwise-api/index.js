require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const deviceRoutes = require("./src/routes/deviceRoutes");
const pool = require("./src/config/db");
const { initSocket } = require("./src/socket");

const app = express();
const server = http.createServer(app);

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

/* ---------------- ROUTES ---------------- */
app.use("/devices", deviceRoutes);

/* ---------------- SOCKET INIT ---------------- */
initSocket(server);

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