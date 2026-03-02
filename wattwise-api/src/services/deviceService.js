const pool = require("../config/db");

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

  return rows[0];
}

/**
 * Toggle device ON/OFF
 */
async function toggleDevice(userId, id) {
  // get current state
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

  return updated.rows[0];
}

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