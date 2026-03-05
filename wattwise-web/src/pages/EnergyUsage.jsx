// src/pages/EnergyUsage.jsx
import React, { useState, useEffect, useRef } from "react";
import "./EnergyUsage.css";

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const PERIODS = ["Daily", "Weekly", "Monthly"];

const STATS = [
  {
    icon: "wb_sunny",
    iconClass: "eu-stat-icon-amber",
    label: "Peak Usage",
    value: "2:45 PM",
    desc: "Highest demand period",
  },
  {
    icon: "eco",
    iconClass: "eu-stat-icon-green",
    label: "Total Savings",
    value: "$42.80",
    desc: "Earned from efficiency",
  },
  {
    icon: "payments",
    iconClass: "eu-stat-icon-blue",
    label: "Projected Bill",
    value: "$184.22",
    desc: "Estimated month-end",
  },
];

const DEVICES = [
  { label: "HVAC System",     pct: 45, color: "#137fec", offset: 0   },
  { label: "Kitchen App.",    pct: 25, color: "#a855f7", offset: 45  },
  { label: "Lighting",        pct: 20, color: "#10b981", offset: 70  },
  { label: "Entertainment",   pct: 10, color: "#f59e0b", offset: 90  },
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const ACTIVE_DAY = "WED";

/* ─────────────────────────────────────────────
   Animated SVG chart path (live wave)
───────────────────────────────────────────── */
function LiveChart() {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    const loop = (ts) => {
      if (lastRef.current !== null)
        setPhase((p) => p + (ts - lastRef.current) * 0.0008);
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, []);

  // Generate animated wave points
  const buildPath = (baseY, amp, freq, phaseOffset) => {
    const pts = [];
    for (let x = 0; x <= 800; x += 20) {
      const y = baseY + Math.sin((x / 800) * freq * Math.PI * 2 + phase + phaseOffset) * amp
                      + Math.sin((x / 800) * (freq * 1.7) * Math.PI + phase * 0.7) * (amp * 0.4);
pts.push(`${x},${Math.max(10, Math.min(290, y))}`);
    }
    return pts;
  };

  const wave1 = buildPath(160, 65, 2, 0);
  const wave2 = buildPath(220, 40, 1.5, 1.2);

  const linePath1 = `M ${wave1.join(" L ")}`;
  const areaPath1 = `M 0,300 L ${wave1.join(" L ")} L 800,300 Z`;
  const linePath2 = `M ${wave2.join(" L ")}`;
  const areaPath2 = `M 0,300 L ${wave2.join(" L ")} L 800,300 Z`;

  return (
    <svg viewBox="0 0 800 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="eu-grad1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#137fec" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#137fec" stopOpacity="0"    />
        </linearGradient>
        <linearGradient id="eu-grad2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Area fills */}
      <path d={areaPath2} fill="url(#eu-grad2)" />
      <path d={areaPath1} fill="url(#eu-grad1)" />

      {/* Lines */}
      <path d={linePath2} fill="none" stroke="#a855f7" strokeWidth="3"
        strokeLinecap="round" strokeDasharray="8 6" />
      <path d={linePath1} fill="none" stroke="#137fec" strokeWidth="4"
        strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Animated donut
───────────────────────────────────────────── */
function AnimatedDonut() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 1 : p + 0.02));
    }, 16);
    return () => clearInterval(id);
  }, []);

  const CIRC = 100; // 2 * π * 15.9 ≈ 100 (scaled)
  const R    = 15.9;

  return (
    <div className="eu-donut-wrap">
      <svg viewBox="0 0 36 36">
        {/* Track */}
        <circle cx="18" cy="18" r={R} fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
        {/* Segments */}
        {DEVICES.map((d) => (
          <circle
            key={d.label}
            cx="18" cy="18" r={R}
            fill="transparent"
            stroke={d.color}
            strokeWidth="3"
            strokeDasharray={`${d.pct * progress} ${CIRC}`}
            strokeDashoffset={-d.offset}
            style={{ transition: "stroke-dasharray 0.05s linear" }}
          />
        ))}
      </svg>
      <div className="eu-donut-center">
        <span className="eu-donut-pct">72%</span>
        <span className="eu-donut-sub">Efficiency</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function EnergyUsage() {
  const [period,  setPeriod]  = useState("Weekly");
  const [visible, setVisible] = useState(false);

  // Trigger mount fade-up
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fu = (delay) => ({
    transitionDelay: `${delay}s`,
  });

  return (
    <div className="eu-root">
      <div className="eu-inner">

        {/* ── Header ── */}
        <div
          className={`eu-header eu-fade-up ${visible ? "eu-visible" : ""}`}
          style={fu(0)}
        >
          <div>
            <div className="eu-header-title-row">
              <div className="eu-icon-badge">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>bolt</span>
              </div>
              <h1 className="eu-page-title">Energy Usage Analytics</h1>
            </div>
            <p className="eu-page-sub">Core consumption and efficiency insights</p>
          </div>

          {/* Period toggle */}
          <div className="eu-toggle">
            {PERIODS.map((p) => (
              <button
                key={p}
                className={`eu-toggle-btn ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="eu-grid">

          {/* ── LEFT ── */}
          <div className="eu-left">

            {/* Chart card */}
            <div
              className={`eu-card eu-chart-card eu-fade-up ${visible ? "eu-visible" : ""}`}
              style={fu(0.1)}
            >
              <div className="eu-chart-header">
                <div>
                  <p className="eu-chart-label">Consumption Over Time</p>
                  <p className="eu-chart-value">
                    428.5 <span>kWh</span>
                  </p>
                  <div className="eu-chart-delta">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_downward</span>
                    12% vs last {period.toLowerCase()}
                  </div>
                </div>
                <div className="eu-legend-pills">
                  <div className="eu-pill eu-pill-blue">
                    <div className="eu-pill-dot" style={{ background: "#3b82f6" }} />
                    Grid
                  </div>
                  <div className="eu-pill eu-pill-amber">
                    <div className="eu-pill-dot" style={{ background: "#f59e0b" }} />
                    Solar
                  </div>
                </div>
              </div>

              {/* Animated SVG chart */}
              <div className="eu-chart-wrap">
                <LiveChart />
              </div>

              {/* Day labels */}
              <div className="eu-chart-axis">
                {DAYS.map((d) => (
                  <span
                    key={d}
                    className={`eu-axis-label ${d === ACTIVE_DAY ? "active" : ""}`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div
              className={`eu-stats-grid eu-fade-up ${visible ? "eu-visible" : ""}`}
              style={fu(0.2)}
            >
              {STATS.map((s) => (
                <div key={s.label} className="eu-card eu-stat-card">
                  <div className={`eu-stat-icon ${s.iconClass}`}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 28, color: "#fff" }}
                    >
                      {s.icon}
                    </span>
                  </div>
                  <p className="eu-stat-label">{s.label}</p>
                  <p className="eu-stat-value">{s.value}</p>
                  <p className="eu-stat-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="eu-right">
            <div
              className={`eu-card eu-right-card eu-fade-up ${visible ? "eu-visible" : ""}`}
              style={fu(0.15)}
            >
              <h3 className="eu-right-title">Device Contribution</h3>

              {/* Animated donut */}
              <AnimatedDonut />

              {/* Device legend */}
              <div className="eu-device-list">
                {DEVICES.map((d) => (
                  <div key={d.label} className="eu-device-row">
                    <div className="eu-device-left">
                      <div className="eu-dot" style={{ background: d.color }} />
                      <span className="eu-device-name">{d.label}</span>
                    </div>
                    <span className="eu-device-pct">{d.pct}%</span>
                  </div>
                ))}
              </div>

              <button className="eu-cta">View Full Breakdown</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}