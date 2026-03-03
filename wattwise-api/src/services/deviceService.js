const pool = require("../config/db");
const { getIO } = require("../socket");

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

/**
 * Add device
 */
async function addDevice(userId, name, watt) {
  const { rows } = await pool.query(
    `INSERT INTO devices (user_id, name, power_rating)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, watt]
  );
const newDevice = rows[0];

const io = getIO();
io.to(userId).emit("energy-update", newDevice);

return newDevice;

  return rows[0];
}

/**
 * Toggle device
 */
async function toggleDevice(userId, id) {
  const { rows } = await pool.query(
    `SELECT * FROM devices WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!rows.length) return null;

  const device = rows[0];

  if (!device.is_on) {
    await pool.query(
      `UPDATE devices
       SET is_on = true,
           start_time = NOW()
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
  } else {
    if (device.start_time) {
      const seconds =
        (Date.now() - new Date(device.start_time).getTime()) / 1000;

      const hours = seconds / 3600;
      const energyUsed =
        (Number(device.power_rating) * hours) / 1000;

      await pool.query(
        `UPDATE devices
         SET is_on = false,
             start_time = NULL,
             total_energy = total_energy + $1
         WHERE id = $2 AND user_id = $3`,
        [energyUsed, id, userId]
      );
    } else {
      await pool.query(
        `UPDATE devices
         SET is_on = false
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
    }
  }

const { rows: updatedRows } = await pool.query(
  `SELECT * FROM devices WHERE id = $1 AND user_id = $2`,
  [id, userId]
);

const updatedDevice = updatedRows[0];

const io = getIO();
io.to(userId).emit("energy-update", updatedDevice);

return updatedDevice;

  return devices;
}

module.exports = {
  addDevice,
  toggleDevice,
  getDevices
};