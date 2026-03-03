async function toggleDevice(userId, id) {
  const { rows } = await pool.query(
    `SELECT * FROM devices WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!rows.length) return null;

  const device = rows[0];

  if (!device.is_on) {
    // TURNING ON
    await pool.query(
      `UPDATE devices
       SET is_on = true,
           start_time = NOW()
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
  } else {
    // TURNING OFF → CALCULATE ENERGY
    const { rows: timeRows } = await pool.query(
      `SELECT EXTRACT(EPOCH FROM (NOW() - start_time)) as seconds
       FROM devices
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    const seconds = timeRows[0].seconds || 0;

    // watts × hours / 1000 = kWh
    const hours = seconds / 3600;
    const energyUsed = (device.power_rating * hours) / 1000;

    await pool.query(
      `UPDATE devices
       SET is_on = false,
           start_time = NULL,
           total_energy = total_energy + $1
       WHERE id = $2 AND user_id = $3`,
      [energyUsed, id, userId]
    );
  }

  const devices = await getDevices(userId);

  const io = getIO();
  io.to(userId).emit("energy-update", devices);

  return devices;
}