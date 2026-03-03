const service = require("../services/deviceService");

// Clerk adds req.auth automatically
exports.addDevice = (req, res) => {
  const userId = req.auth.userId;

  const { name, watt } = req.body;
 exports.addDevice = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name, watt } = req.body;

    const device = await service.addDevice(userId, name, Number(watt));

    res.json({
      status: "success",
      data: device,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add device",
    });
  }
};

exports.toggleDevice = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const device = await service.toggleDevice(
      userId,
      req.params.id
    );

    res.json(device);

  } catch (err) {
    res.status(500).send("Toggle failed");
  }
};

exports.getDevices = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const devices = await service.getDevices(userId);

    res.json(devices);

  } catch (err) {
    res.status(500).send("Fetch failed");
  }
};
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