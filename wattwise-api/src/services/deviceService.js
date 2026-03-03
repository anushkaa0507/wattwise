const pool = require("../config/db");
const { getIO } = require("../socket");

/**
 * Add new device
 */
async function addDevice(userId, name, watt) {
  const { rows } = await pool.query(
    `INSERT INTO devices (user_id, name, power_rating)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, watt]
  );

  const devices = await getDevices(userId);

  // realtime update
  const io = getIO();
  io.to(userId).emit("energy-update", devices);

  return rows[0];
}

/**
 * Toggle device ON/OFF
 */
async function toggleDevice(userId, id) {
  const { rows } = await pool.query(
    `SELECT * FROM devices 
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!rows.length) return null;

  const device = rows[0];
  const isOn = !device.is_on;
  const startTime = isOn ? Date.now() : null;

  await pool.query(
    `UPDATE devices
     SET is_on = $1,
         start_time = $2
     WHERE id = $3`,
    [isOn, startTime, id]
  );

  const io = getIO();
  const devices = await getDevices(userId);

  io.to(userId).emit("energy-update", devices);

  return { ...device, is_on: isOn };
}

/**
 * Get devices
 */
async function getDevices(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM devices
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

module.exports = {
  addDevice,
  toggleDevice,
  getDevices
};