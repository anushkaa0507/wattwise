// src/pages/DeviceAnalytics.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";  // ← NEW: For token
import "./DeviceAnalytics.css";

const BASE_URL = import.meta.env.VITE_API_URL;  // ← NEW: Your API base

/* ─────────────────────────────────────────────
   Static fallbacks (unchanged—used if API fails)
───────────────────────────────────────────── */
const STATIC_DEVICES = [  // ← Renamed from DEVICES
  {
    name: "Smart Fan",
    icon: "cyclone",
    status: "Active Now",
    active: true,
    color: "#137fec",
    stats: {
      power: "42.8",  powerUnit: "Watts",
      energy: "1.24", energyUnit: "kWh", energyDelta: "+5% from yesterday", deltaUp: true,
      mode: "Eco Mode",    modeIcon: "eco",          modeColor: "#16a34a", modeBg: "#f0fdf4",
      health: "Excellent", healthIcon: "verified",    healthColor: "#137fec", healthBg: "#eff6ff",
    },
  },
  // ... (Keep all your other static devices unchanged)
  {
    name: "Desk Lamp",
    icon: "table_lamp",
    status: "Standby",
    active: false,
    color: "#f59e0b",
    stats: {
      power: "8.5",   powerUnit: "Watts",
      energy: "0.21", energyUnit: "kWh", energyDelta: "-12% from yesterday", deltaUp: false,
      mode: "Standby",  modeIcon: "bedtime",       modeColor: "#d97706", modeBg: "#fffbeb",
      health: "Good",   healthIcon: "check_circle", healthColor: "#16a34a", healthBg: "#f0fdf4",
    },
  },
  {
    name: "Living Room",
    icon: "lightbulb",
    status: "Offline",
    active: false,
    color: "#94a3b8",
    stats: {
      power: "0.0",   powerUnit: "Watts",
      energy: "0.00", energyUnit: "kWh", energyDelta: "No data available", deltaUp: false,
      mode: "Offline",   modeIcon: "wifi_off", modeColor: "#94a3b8", modeBg: "#f1f5f9",
      health: "Unknown", healthIcon: "help",    healthColor: "#94a3b8", healthBg: "#f1f5f9",
    },
  },
  {
    name: "Smart TV",
    icon: "tv",
    status: "Standby",
    active: false,
    color: "#8b5cf6",
    stats: {
      power: "95.0",  powerUnit: "Watts",
      energy: "2.85", energyUnit: "kWh", energyDelta: "+18% from yesterday", deltaUp: true,
      mode: "4K HDR",      modeIcon: "hd",        modeColor: "#7c3aed", modeBg: "#f5f3ff",
      health: "Excellent", healthIcon: "verified", healthColor: "#8b5cf6", healthBg: "#f5f3ff",
    },
  },
  {
    name: "Fridge",
    icon: "kitchen",
    status: "Standby",
    active: false,
    color: "#06b6d4",
    stats: {
      power: "150.3", powerUnit: "Watts",
      energy: "3.61", energyUnit: "kWh", energyDelta: "+2% from yesterday", deltaUp: true,
      mode: "Cool 4°C", modeIcon: "ac_unit",      modeColor: "#0891b2", modeBg: "#ecfeff",
      health: "Good",   healthIcon: "check_circle", healthColor: "#0891b2", healthBg: "#ecfeff",
    },
  },
];

const INIT_BARS = [30, 45, 40, 65, 55, 35, 70, 50, 25, 60, 40, 85, 65, 50, 30, 75, 45, 95];
const SPARK     = [20, 45, 30, 65, 100, 60];

const BREAKDOWN = [
  { color: "#60a5fa", shadow: "#60a5fa80", label: "Fan Usage",  val: "110 kWh" },
  { color: "#818cf8", shadow: "#818cf880", label: "Lamp Usage", val: "61 kWh"  },
  { color: "#22d3ee", shadow: "#22d3ee80", label: "Others",     val: "49 kWh"  },
];

const MULTIBAR = [
  { w: "45%", c: "#60a5fa" },
  { w: "25%", c: "#818cf8" },
  { w: "20%", c: "#22d3ee" },
  { w: "10%", c: "#cbd5e1" },
];

const INSIGHT_TEXT = [
  <><b>Smart Fan</b> has been running <b>8 hours</b>. Eco Mode could save you</>,
  <><b>Desk Lamp</b> is on standby. Schedule auto-off to save</>,
  <><b>Living Room</b> light is offline. Check connection to recover</>,
  <><b>Smart TV</b> draws high power. Enabling sleep mode saves</>,
  <><b>Fridge</b> is running optimally. Adjusting to 6°C saves</>,
];
const INSIGHT_PCT = ["12%", "18%", "—", "22%", "9%"];
const INSIGHT_SUB = ["on your weekly bill", "on your weekly bill", "device unreachable", "on your weekly bill", "on your weekly bill"];
const INSIGHT_BTN = ["Apply Eco-Schedules", "Schedule Auto-Off", "Check Connection", "Enable Sleep Mode", "Optimize Cooling"];

/** Append 0-255 alpha derived from a 0-100 percentage onto a hex color */
function hexAlpha(hex, pct) {
  return hex + Math.round((pct / 100) * 0.9 * 255).toString(16).padStart(2, "0");
}

function statusColors(status) {
  if (status === "Offline")    return { bg: "#fee2e2", text: "#dc2626", dot: "#dc2626" };
  if (status === "Active Now") return { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" };
  return                              { bg: "#fef9c3", text: "#92400e", dot: "#f59e0b" };
}

/* ─────────────────────────────────────────────
   Per-device animated visuals (unchanged)
───────────────────────────────────────────── */
function FanVisual({ color }) {
  const [rot, setRot] = useState(0);
  const raf  = useRef(null);
  const last = useRef(null);

  useEffect(() => {
    const loop = (ts) => {
      if (last.current !== null) setRot((r) => (r + (ts - last.current) * 0.22) % 360);
      last.current = ts;
      raf.current  = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf.current); last.current = null; };
  }, []);

  return (
    <div className="da-visual-wrap">
      <div className="da-fan-ring">
        <div className="da-fan-orbit-1" style={{ border: `1px solid ${color}33` }} />
        <div className="da-fan-orbit-2" style={{ border: `1px solid ${color}1a` }} />
        <span
          className="material-symbols-outlined da-fan-ghost"
          style={{ color: `${color}18`, transform: `rotate(${rot}deg)` }}
        >cyclone</span>
        <div className="da-fan-card">
          <span
            className="material-symbols-outlined da-fan-icon"
            style={{ color, transform: `rotate(${rot}deg)` }}
          >toys_fan</span>
          <div className="da-fan-dots">
            {[color, "#e2e8f0", "#e2e8f0"].map((c, i) => (
              <div key={i} className="da-fan-dot" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (Keep all other visuals unchanged: LampVisual, OfflineVisual, TVVisual, FridgeVisual)

/* ─────────────────────────────────────────────
   Main component (dynamic fetches added)
───────────────────────────────────────────── */
export default function DeviceAnalytics() {
  const { getToken } = useAuth();  // ← NEW
  const [devices, setDevices] = useState([]);  // ← DYNAMIC
  const [sel, setSel] = useState(0);
  const [deviceDetail, setDeviceDetail] = useState(null);  // ← NEW
  const [mounted, setMounted] = useState(false);
  const [bars, setBars] = useState(INIT_BARS);  // ← DYNAMIC
  const [spark, setSpark] = useState(SPARK);  // ← DYNAMIC
  const [cardAnim, setCardAnim] = useState(false);
  const [loading, setLoading] = useState(true);  // ← NEW

  // Fetch devices on mount
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/api/device-analytics/devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setDevices(data);
        if (data.length > 0) setSel(0);
      } catch (err) {
        console.error(err);
        setDevices(STATIC_DEVICES);  // ← FALLBACK
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
  }, [getToken]);

  // Load detail/chart on select (syncs animations)
  useEffect(() => {
    if (devices.length === 0 || loading) return;
    const loadDetail = async () => {
      try {
        const token = await getToken();
        const devId = devices[sel].id;
        // Detail
        const detailRes = await fetch(`${BASE_URL}/api/device-analytics/${devId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (detailRes.ok) {
          const detail = await detailRes.json();
          setDeviceDetail(detail);
          // Charts
          const chartRes = await fetch(`${BASE_URL}/api/device-analytics/${devId}/chart?minutes=60`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (chartRes.ok) {
            const { data } = await chartRes.json();
            setBars(data.slice(0, 18));  // Main bars
            setSpark(data.slice(0, 6));  // Sparkline
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadDetail();
  }, [sel, devices, getToken]);

  // Real-time poll (60s for live updates—syncs bars animation)
  useEffect(() => {
    if (!devices.length) return;
    const interval = setInterval(() => {
      // Re-fetch chart for current sel
      // (Call loadDetail again or extend with socket)
    }, 60000);
    return () => clearInterval(interval);
  }, [sel]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (i) => {
    if (i === sel) return;
    setCardAnim(true);
    setTimeout(() => { setSel(i); setCardAnim(false); }, 260);
  };

  const dev = devices[sel] || STATIC_DEVICES[sel] || {};  // ← DYNAMIC WITH FALLBACK
  const COLOR = dev.color || "#94a3b8";
  const badge = statusColors(dev.status || "Offline");
  const detail = deviceDetail || dev;  // ← DYNAMIC

  if (loading) return <div className="da-root">Loading analytics...</div>;  // ← LOADING

  const fade = (delay) => `da-fade ${mounted ? "da-visible" : ""}`;
  const animCls = cardAnim ? "da-card-out" : "da-card-in";

  const AnimatedVisual = () => {
    switch (sel) {
      case 0: return <FanVisual color={COLOR} />;
      case 1: return <LampVisual color={COLOR} />;
      case 2: return <OfflineVisual color={COLOR} />;
      case 3: return <TVVisual color={COLOR} />;
      case 4: return <FridgeVisual color={COLOR} />;
      default: return null;
    }
  };

  return (
    <div className="da-root">
      <div className="da-inner">

        {/* Title (unchanged) */}
        <div className={`da-title-wrap ${fade()}`} style={{ transitionDelay: "0s" }}>
          <h1 className="da-title">WattWise Device Analytics</h1>
          <p className="da-subtitle">Focused Real-time Performance &amp; Telemetry</p>
        </div>

        {/* Device selector (dynamic) */}
        <div className={`da-selector ${fade()}`} style={{ transitionDelay: "0.1s" }}>
          {devices.map((d, i) => (
            <button
              key={d.id || i}  // ← USE ID OR FALLBACK
              onClick={() => handleSelect(i)}
              className={`da-device-btn ${sel === i ? "active" : ""}`}
              style={{
                border: sel === i ? `2px solid ${d.color}` : undefined,
                boxShadow: sel === i ? `0 8px 32px ${d.color}22` : undefined,
              }}
            >
              <div className="da-device-icon-wrap" style={{ background: sel === i ? `${d.color}18` : undefined }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: sel === i ? d.color : "#94a3b8" }}>
                  {d.icon}
                </span>
                {d.active && <div className="da-active-dot" />}
              </div>
              <p className={`da-device-name ${sel === i ? "active" : ""}`}>{d.name}</p>
              <p className="da-device-status" style={{ color: sel === i ? d.color : undefined }}>
                {d.status}
              </p>
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="da-main-grid">

          {/* LEFT */}
          <div className="da-col-left">

            {/* Performance card */}
            <div className={`da-perf-card ${fade()} ${animCls}`} style={{ transitionDelay: "0.2s" }}>
              <div className="da-perf-glow" style={{ background: `${COLOR}0d` }} />

              <div className="da-perf-header">
                <div>
                  <h2 className="da-perf-title">Live Performance: {dev.name}</h2>
                  <p className="da-perf-desc">Real-time telemetry and energy output</p>
                </div>
                <div className="da-status-badge" style={{ background: badge.bg, color: badge.text }}>
                  <div
                    className="da-status-dot"
                    style={{
                      background: badge.dot,
                      animation: dev.status !== "Offline" ? "da-pulse 2s infinite" : "none",
                    }}
                  />
                  {dev.status.toUpperCase()}
                </div>
              </div>

              <div className="da-content-grid">
                <AnimatedVisual />

                <div className="da-stats-grid">
                  {/* Power */}
                  <div className="da-stat-card">
                    <p className="da-stat-label">Current Power</p>
                    <div className="da-stat-value-row">
                      <span className="da-stat-value">{dev.stats.power}</span>
                      <span className="da-stat-unit">{dev.stats.powerUnit}</span>
                    </div>
                    <div className="da-spark-row">
                      {spark.map((h, i) => (  // ← DYNAMIC SPARK
                        <div key={i} className="da-spark-bar" style={{ height: `${h}%`, background: hexAlpha(COLOR, h) }} />
                      ))}
                    </div>
                  </div>

                  {/* Energy */}
                  <div className="da-stat-card">
                    <p className="da-stat-label">Energy Today</p>
                    <div className="da-stat-value-row">
                      <span className="da-stat-value">{dev.stats.energy}</span>
                      <span className="da-stat-unit">{dev.stats.energyUnit}</span>
                    </div>
                    <div className="da-delta-row">
                      <span
                        className="material-symbols-outlined da-delta-icon"
                        style={{ color: dev.stats.deltaUp ? "#16a34a" : "#94a3b8" }}
                      >
                        {dev.stats.deltaUp ? "trending_up" : "trending_flat"}
                      </span>
                      <span className="da-delta-text" style={{ color: dev.stats.deltaUp ? "#16a34a" : "#94a3b8" }}>
                        {dev.stats.energyDelta}
                      </span>
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="da-stat-card">
                    <p className="da-stat-label">Mode</p>
                    <div className="da-mode-row">
                      <div className="da-mode-icon-wrap" style={{ background: dev.stats.modeBg }}>
                        <span className="material-symbols-outlined da-mode-icon" style={{ color: dev.stats.modeColor }}>
                          {dev.stats.modeIcon}
                        </span>
                      </div>
                      <span className="da-mode-label">{dev.stats.mode}</span>
                    </div>
                  </div>

                  {/* Health */}
                  <div className="da-stat-card">
                    <p className="da-stat-label">Health Status</p>
                    <div className="da-mode-row">
                      <div className="da-mode-icon-wrap" style={{ background: dev.stats.healthBg }}>
                        <span className="material-symbols-outlined da-mode-icon" style={{ color: dev.stats.healthColor }}>
                          {dev.stats.healthIcon}
                        </span>
                      </div>
                      <span className="da-mode-label">{dev.stats.health}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live chart */}
            <div className={`da-chart-card ${fade()}`} style={{ transitionDelay: "0.35s" }}>
              <div className="da-chart-header">
                <div>
                  <h4 className="da-chart-title">Real-time Wattage Consumption</h4>
                  <p className="da-chart-sub">Last 60 minutes live telemetry</p>
                </div>
                <div className="da-chart-pills">
                  <span className="da-pill-mins">60 MINS</span>
                  <span className="da-pill-live" style={{ background: COLOR }}>LIVE</span>
                </div>
              </div>
              <div className="da-bars-wrap">
                {bars.map((pct, i) => (  // ← DYNAMIC BARS
                  <div
                    key={i}
                    className="da-bar"
                    style={{
                      height: `${pct}%`,
                      background: hexAlpha(COLOR, pct),
                      boxShadow: pct > 80 ? `0 4px 16px ${COLOR}33` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="da-col-right">

            {/* Energy Breakdown */}
            <div className={`da-breakdown-card ${fade()}`} style={{ transitionDelay: "0.3s" }}>
              <h4 className="da-breakdown-title">Energy Breakdown</h4>
              <div className="da-breakdown-total-row">
                <span className="da-breakdown-total-label">Total Network Usage</span>
                <span className="da-breakdown-total-val">245 kWh</span>  // ← Update with sum if needed
              </div>
              <div className="da-multibar">
                {MULTIBAR.map((seg, i) => (
                  <div
                    key={i}
                    className="da-multibar-seg"
                    style={{
                      width: seg.w,
                      background: seg.c,
                      boxShadow: i < 3 ? "inset -2px 0 4px rgba(0,0,0,0.1)" : "none",
                    }}
                  />
                ))}
              </div>
              {BREAKDOWN.map((r) => (
                <div key={r.label} className="da-legend-row">
                  <div className="da-legend-left">
                    <div className="da-legend-dot" style={{ background: r.color, boxShadow: `0 2px 6px ${r.shadow}` }} />
                    <span className="da-legend-name">{r.label}</span>
                  </div>
                  <span className="da-legend-val">{r.val}</span>
                </div>
              ))}
            </div>

            {/* Smart Insight */}
            <div
              className={`da-insight-card ${fade()} ${animCls}`}
              style={{
                background: COLOR,
                boxShadow: `0 20px 60px ${COLOR}55`,
                transitionDelay: "0.45s",
              }}
            >
              <div className="da-insight-glow" />
              <div className="da-insight-header">
                <div className="da-insight-icon-wrap">
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 28 }}>lightbulb</span>
                </div>
                <h4 className="da-insight-title">Smart Insight</h4>
              </div>
              <p className="da-insight-body">Your {INSIGHT_TEXT[sel]}</p>
              <div className="da-insight-pct">{INSIGHT_PCT[sel]}</div>
              <div className="da-insight-sub">{INSIGHT_SUB[sel]}</div>
              <button className="da-insight-btn" style={{ color: COLOR }}>
                {INSIGHT_BTN[sel]}
              </button>
            </div>

            {/* Add device */}
            <button
              className={`da-add-btn ${fade()}`}
              style={{ transitionDelay: "0.55s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
            >
              <div className="da-add-icon-wrap">
                <span className="material-symbols-outlined" style={{ color: "#94a3b8", fontSize: 28 }}>add</span>
              </div>
              <h5 className="da-add-title">Add New Device</h5>
              <p className="da-add-desc">Connect more smart appliances to expand your ecosystem</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}