const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./src/routes/deviceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", deviceRoutes);

app.listen(5000, () => {
  console.log("⚡ WattWise API running on port 5000");
});
