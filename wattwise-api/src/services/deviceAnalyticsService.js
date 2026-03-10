const pool = require("../config/db");
async function getDevicesWithAnalytics(userId) {
  const { rows } = await pool.query(
    `SELECT 
      d.id, d.name, d.power_rating, d.is_on, d.total_energy,
      d.created_at, d.start_time,
      COALESCE(avg_energy_today, 0) as avg_energy_today,
      COALESCE(energy_delta, 0) as energy_delta,
      COALESCE(delta_up, false) as delta_up,
      COALESCE(health_status, 'Good') as health_status,
      COALESCE(current_mode, 'Normal') as current_mode
     FROM devices d
     LEFT JOIN (
       SELECT device_id,
              AVG(total_energy) as avg_energy_today,
              (AVG(total_energy) - LAG(AVG(total_energy)) OVER (ORDER BY date_trunc('day', updated_at))) / LAG(AVG(total_energy)) OVER (ORDER BY date_trunc('day', updated_at)) * 100 as energy_delta,
              CASE WHEN AVG(total_energy) > LAG(AVG(total_energy)) OVER (ORDER BY date_trunc('day', updated_at)) THEN true ELSE false END as delta_up
       FROM device_logs
       WHERE user_id = $1 AND updated_at >= NOW() - INTERVAL '7 days'
       GROUP BY device_id, date_trunc('day', updated_at)
       ORDER BY device_id
     ) logs ON d.id = logs.device_id
     WHERE d.user_id = $1
     ORDER BY d.created_at DESC`,
    [userId]
  );

  // Map to frontend structure (static-like but dynamic)
  return rows.map(row => ({
    name: row.name,
    icon: detectIcon(row.name),
    status: row.is_on ? "Active Now" : "Standby",
    active: row.is_on,
    color: getColorByType(detectType(row.name)),
    stats: {
      power: row.is_on ? (row.power_rating || 50).toFixed(1) : "0.0",
      powerUnit: "Watts",
      energy: (row.total_energy || 0).toFixed(2),
      energyUnit: "kWh",
      energyDelta: `${(row.energy_delta || 0).toFixed(1)}% from yesterday`,
      deltaUp: row.delta_up,
      mode: row.current_mode || "Normal",
      modeIcon: getModeIcon(row.current_mode),
      modeColor: getModeColor(row.current_mode),
      modeBg: getModeBg(row.current_mode),
      health: row.health_status,
      healthIcon: getHealthIcon(row.health_status),
      healthColor: getHealthColor(row.health_status),
      healthBg: getHealthBg(row.health_status),
    },
  }));
}

async function getDeviceAnalytics(userId, deviceId) {
  const { rows } = await pool.query(
    `SELECT 
      d.*, dl.power_usage, dl.energy_consumed, dl.timestamp,
      COALESCE(health_score, 85) as health_score,
      COALESCE(mode, 'Normal') as mode
     FROM devices d
     LEFT JOIN device_logs dl ON d.id = dl.device_id
     WHERE d.id = $1 AND d.user_id = $2 AND dl.timestamp >= NOW() - INTERVAL '1 hour'
     ORDER BY dl.timestamp DESC
     LIMIT 1`,
    [deviceId, userId]
  );
  if (!rows.length) return null;
  const device = rows[0];
  return {
    name: device.name,
    power: device.power_usage?.toFixed(1) || (device.power_rating || 50).toFixed(1),
    energy: device.energy_consumed?.toFixed(2) || device.total_energy?.toFixed(2) || "0.00",
    mode: device.mode,
    health: device.health_score > 80 ? "Excellent" : device.health_score > 60 ? "Good" : "Fair",
    // Simulate delta
    energyDelta: "+5% from yesterday",
    deltaUp: true,
    chartData: generateChartData(device.power_rating || 50),
    breakdown: generateBreakdown(),
    insight: generateInsight(device.name),
  };
}
async function getDeviceChartData(userId, deviceId, minutes = 60) {
  const { rows } = await pool.query(
    `SELECT timestamp, power_usage
     FROM device_logs
     WHERE device_id = $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '${minutes} minutes'
     ORDER BY timestamp ASC`,
    [deviceId, userId]
  );
  return rows.map(row => row.power_usage || Math.random() * 100).concat(
    Array.from({ length: Math.max(0, 18 - rows.length) }, () => 20 + Math.random() * 75)
  );
}
function detectType(name) {
  const n = name.toLowerCase();
  if (n.includes("fan")) return "fan";
  if (n.includes("lamp") || n.includes("light")) return "lamp";
  if (n.includes("tv")) return "tv";
  if (n.includes("fridge")) return "fridge";
  return "other";
}
function detectIcon(name) {
  const type = detectType(name);
  const icons = { fan: "cyclone", lamp: "table_lamp", tv: "tv", fridge: "kitchen", other: "lightbulb" };
  return icons[type] || "lightbulb";
}
function getColorByType(type) {
  const colors = { fan: "#137fec", lamp: "#f59e0b", tv: "#8b5cf6", fridge: "#06b6d4", other: "#94a3b8" };
  return colors[type] || "#94a3b8";
}
function getModeIcon(mode) {
  const icons = { "Eco Mode": "eco", "Standby": "bedtime", "4K HDR": "hd", "Cool 4°C": "ac_unit", Normal: "settings" };
  return icons[mode] || "settings";
}
function getModeColor(mode) {
  const colors = { "Eco Mode": "#16a34a", "Standby": "#d97706", "4K HDR": "#7c3aed", "Cool 4°C": "#0891b2", Normal: "#6b7280" };
  return colors[mode] || "#6b7280";
}
function getModeBg(mode) {
  const bgs = { "Eco Mode": "#f0fdf4", "Standby": "#fffbeb", "4K HDR": "#f5f3ff", "Cool 4°C": "#ecfeff", Normal: "#f1f5f9" };
  return bgs[mode] || "#f1f5f9";
}
function getHealthIcon(health) {
  const icons = { Excellent: "verified", Good: "check_circle", Fair: "warning", Unknown: "help" };
  return icons[health] || "help";
}
function getHealthColor(health) {
  const colors = { Excellent: "#137fec", Good: "#16a34a", Fair: "#d97706", Unknown: "#94a3b8" };
  return colors[health] || "#94a3b8";
}
function getHealthBg(health) {
  const bgs = { Excellent: "#eff6ff", Good: "#f0fdf4", Fair: "#fef3c7", Unknown: "#f1f5f9" };
  return bgs[health] || "#f1f5f9";
}
function generateChartData(basePower) {
  return Array.from({ length: 18 }, (_, i) => basePower * 0.8 + Math.sin(i / 3) * 20 + Math.random() * 10);
}
function generateBreakdown() {
  return [
    { color: "#60a5fa", shadow: "#60a5fa80", label: "Fan Usage", val: "110 kWh" },
    { color: "#818cf8", shadow: "#818cf880", label: "Lamp Usage", val: "61 kWh" },
    { color: "#22d3ee", shadow: "#22d3ee80", label: "Others", val: "49 kWh" },
  ];
}
function generateInsight(name) {
  const insights = {
    "Smart Fan": { text: <><b>Smart Fan</b> has been running <b>8 hours</b>. Eco Mode could save you</>, pct: "12%", sub: "on your weekly bill", btn: "Apply Eco-Schedules" },
    "Desk Lamp": { text: <><b>Desk Lamp</b> is on standby. Schedule auto-off to save</>, pct: "18%", sub: "on your weekly bill", btn: "Schedule Auto-Off" },
    "Living Room": { text: <><b>Living Room</b> light is offline. Check connection to recover</>, pct: "—", sub: "device unreachable", btn: "Check Connection" },
    "Smart TV": { text: <><b>Smart TV</b> draws high power. Enabling sleep mode saves</>, pct: "22%", sub: "on your weekly bill", btn: "Enable Sleep Mode" },
    "Fridge": { text: <><b>Fridge</b> is running optimally. Adjusting to 6°C saves</>, pct: "9%", sub: "on your weekly bill", btn: "Optimize Cooling" },
  };
  return insights[name] || insights["Smart Fan"];
}
module.exports = {
  getDevicesWithAnalytics,
  getDeviceAnalytics,
  getDeviceChartData,
};