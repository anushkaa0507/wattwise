const { createDevice } = require("../models/deviceModel");

// store devices per user (important for SaaS architecture)
const userDevices = {};

function addDevice(userId, name, watt) {
  if (!userDevices[userId]) userDevices[userId] = [];

  const device = createDevice(name, watt);
  userDevices[userId].push(device);

  return device;
}

function toggleDevice(userId, id) {
  const devices = userDevices[userId] || [];

  const device = devices.find((d) => d.id === id);
  if (!device) return null;

  device.isOn = !device.isOn;
  device.startTime = device.isOn ? Date.now() : null;

  return device;
}

function getDevices(userId) {
  return userDevices[userId] || [];
}

module.exports = { addDevice, toggleDevice, getDevices };