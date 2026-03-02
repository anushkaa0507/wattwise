const pool = require("../config/db");
const { io } = require("../../index");

/**
 * Add a new device
 */
async function addDevice(userId, name, watt) {
  const { rows } = await pool.query(
    `INSERT INTO devices (user_id, name, watt)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, watt]
  );

  const devices = await getDevices(userId);

  // 🔥 realtime update
  io.to(userId).emit("energy-update", devices);

  return rows[0];
}

/**
 * Toggle device ON/OFF
 */
async function toggleDevice(userId, id) {
  const { rows } = await pool.query(
    `SELECT * FROM devices WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!rows.length) return null;

  const device = rows[0];
  const isOn = !device.is_on;

  await pool.query(
    `UPDATE devices
     SET is_on = $1
     WHERE id = $2`,
    [isOn, id]
  );

  const devices = await getDevices(userId);

  // 🔥 realtime update
  io.to(userId).emit("energy-update", devices);

  return true;
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

module.exports = { addDevice, toggleDevice, getDevices };