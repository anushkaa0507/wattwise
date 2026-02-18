function createDevice(name, watt) {
  return {
    id: Date.now().toString(),
    name,
    watt,
    isOn: false,
    startTime: null,
    units: 0
  };
}

module.exports = { createDevice };
