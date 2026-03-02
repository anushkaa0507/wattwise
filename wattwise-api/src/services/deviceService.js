const pool = require("../config/db");
const { io } = require("../../index");
const { getIO } = require("../socket");
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

  if (rows.length === 0) return null;

  const device = rows[0];
  const isOn = !device.is_on;
  const startTime = isOn ? Date.now() : null;

  const updated = await pool.query(
    `UPDATE devices
     SET is_on = $1, start_time = $2
     WHERE id = $3
     RETURNING *`,
    [isOn, startTime, id]
  );

  // 🔥 Emit real-time update
  const io = getIO();
  const devices = await getDevices(userId);
  io.to(userId).emit("energy-update", devices);

  return updated.rows[0];
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