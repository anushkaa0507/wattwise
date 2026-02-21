const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./src/routes/deviceRoutes");
const authRoutes = require("./src/auth/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", deviceRoutes);

app.listen(5000, () => {
  console.log("⚡ WattWise API running on port 5000");
});
