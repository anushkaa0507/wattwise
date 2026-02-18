const service = require("../services/deviceService");

exports.addDevice = (req, res) => {
  const { name, watt } = req.body;
  const device = service.addDevice(name, watt);
  res.json(device);
};

exports.toggleDevice = (req, res) => {
  const device = service.toggleDevice(req.params.id);
  res.json(device);
};

exports.getDevices = (req, res) => {
  res.json(service.getDevices());
};
