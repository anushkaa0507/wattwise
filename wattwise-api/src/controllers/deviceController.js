const service = require("../services/deviceService");

// Clerk adds req.auth automatically
exports.addDevice = (req, res) => {
  const userId = req.auth.userId;

  const { name, watt } = req.body;
  const device = service.addDevice(userId, name, watt);

  res.json(device);
};

exports.toggleDevice = (req, res) => {
  const userId = req.auth.userId;

  const device = service.toggleDevice(userId, req.params.id);
  res.json(device);
};

exports.getDevices = (req, res) => {
  const userId = req.auth.userId;

  res.json(service.getDevices(userId));
};