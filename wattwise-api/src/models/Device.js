const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String,
  watt: Number,
  isOn: {
    type: Boolean,
    default: false,
  },
  startTime: Number,
  units: {
    type: Number,
    default: 0,
  },
  liveUnits: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);