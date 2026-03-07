const pool = require("../config/db");

/**
 * Device analytics
 */
async function getDeviceAnalytics(userId) {
  const { rows } = await pool.query(
    `SELECT 
        id,
        name,
        power_rating,
        total_energy,
        is_on,
        start_time,
        created_at
     FROM devices
     WHERE user_id = $1`,
    [userId]
  );

  const devices = rows.map((d) => {
    let currentPower = 0;

    if (d.is_on) {
      currentPower = Number(d.power_rating);
    }

    return {
      id: d.id,
      name: d.name,
      power: currentPower,
      energy: Number(d.total_energy).toFixed(2),
      status: d.is_on ? "Active Now" : "Standby",
      powerUnit: "Watts",
      energyUnit: "kWh"
    };
  });

  const totalEnergy = devices.reduce(
    (sum, d) => sum + Number(d.energy),
    0
  );

  return {
    devices,
    totalEnergy
  };
}

module.exports = { getDeviceAnalytics };