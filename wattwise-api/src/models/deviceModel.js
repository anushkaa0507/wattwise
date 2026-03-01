const { v4: uuidv4 } = require("uuid");

function createDevice(name, watt) {
  return {
    id: uuidv4(),
    name,
    watt,
    isOn: false,
    startTime: null,
    totalEnergy: 0, 
  };
}

module.exports = { createDevice };