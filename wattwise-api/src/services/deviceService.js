const devices = require("../data/devices");
const { createDevice } = require("../models/deviceModel");

function addDevice(name, watt) {
  const device = createDevice(name, watt);
  devices.push(device);
  return device;
}

function toggleDevice(id) {
  const device = devices.find(d => d.id === id);

  if (!device) return null;

  if (!device.isOn) {
    device.isOn = true;
    device.startTime = Date.now();
  } else {
    const duration = (Date.now() - device.startTime) / 3600000;
    device.units += (device.watt * duration) / 1000;
    device.isOn = false;
    device.startTime = null;
  }

  return device;
}

function getDevices() {
  return devices;
}

module.exports = { addDevice, toggleDevice, getDevices };
