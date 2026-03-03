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

/* ---------- REQUIRED FOR RENDER ---------- */
app.get("/", (req, res) => {
  res.send("WattWise API is running ⚡");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

/* ---------- ROUTES ---------- */
const { requireAuth } = require("@clerk/express");

app.use("/devices", requireAuth(), deviceRoutes);
/* ---------- SOCKET ---------- */
initSocket(server);

/* ---------- START ---------- */
const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ DB Connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`⚡ Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB failed:", err);
    process.exit(1);
  });