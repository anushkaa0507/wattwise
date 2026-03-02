require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const pool = require("./src/config/db");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

// Test PostgreSQL connection
pool.query("SELECT NOW()")
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