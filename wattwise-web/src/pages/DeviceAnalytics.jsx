// src/pages/DeviceAnalytics.jsx
import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   Device data
───────────────────────────────────────────── */
const DEVICES = [
  {
    name: "Smart Fan",
    icon: "cyclone",
    status: "Active Now",
    active: true,
    color: "#137fec",
    accent: "#60a5fa",
    stats: {
      power: "42.8",    powerUnit: "Watts",
      energy: "1.24",   energyUnit: "kWh",  energyDelta: "+5% from yesterday", deltaUp: true,
      mode: "Eco Mode", modeIcon: "eco",    modeColor: "#16a34a", modeBg: "#f0fdf4",
      health: "Excellent", healthIcon: "verified", healthColor: "#137fec", healthBg: "#eff6ff",
    },
  },
  {
    name: "Desk Lamp",
    icon: "table_lamp",
    status: "Standby",
    active: false,
    color: "#f59e0b",
    accent: "#fcd34d",
    stats: {
      power: "8.5",     powerUnit: "Watts",
      energy: "0.21",   energyUnit: "kWh",  energyDelta: "-12% from yesterday", deltaUp: false,
      mode: "Standby",  modeIcon: "bedtime", modeColor: "#d97706", modeBg: "#fffbeb",
      health: "Good",   healthIcon: "check_circle", healthColor: "#16a34a", healthBg: "#f0fdf4",
    },
  },
  {
    name: "Living Room",
    icon: "lightbulb",
    status: "Offline",
    active: false,
    color: "#94a3b8",
    accent: "#cbd5e1",
    stats: {
      power: "0.0",     powerUnit: "Watts",
      energy: "0.00",   energyUnit: "kWh",  energyDelta: "No data available", deltaUp: false,
      mode: "Offline",  modeIcon: "wifi_off", modeColor: "#94a3b8", modeBg: "#f1f5f9",
      health: "Unknown",healthIcon: "help", healthColor: "#94a3b8", healthBg: "#f1f5f9",
    },
  },
  {
    name: "Smart TV",
    icon: "tv",
    status: "Standby",
    active: false,
    color: "#8b5cf6",
    accent: "#c4b5fd",
    stats: {
      power: "95.0",    powerUnit: "Watts",
      energy: "2.85",   energyUnit: "kWh",  energyDelta: "+18% from yesterday", deltaUp: true,
      mode: "4K HDR",   modeIcon: "hd", modeColor: "#7c3aed", modeBg: "#f5f3ff",
      health: "Excellent", healthIcon: "verified", healthColor: "#8b5cf6", healthBg: "#f5f3ff",
    },
  },
  {
    name: "Fridge",
    icon: "kitchen",
    status: "Standby",
    active: false,
    color: "#06b6d4",
    accent: "#67e8f9",
    stats: {
      power: "150.3",   powerUnit: "Watts",
      energy: "3.61",   energyUnit: "kWh",  energyDelta: "+2% from yesterday", deltaUp: true,
      mode: "Cool 4°C", modeIcon: "ac_unit", modeColor: "#0891b2", modeBg: "#ecfeff",
      health: "Good",   healthIcon: "check_circle", healthColor: "#0891b2", healthBg: "#ecfeff",
    },
  },
];

/* ─────────────────────────────────────────────
   Per-device animated visuals
───────────────────────────────────────────── */

// 1 — Smart Fan
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
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{
        width:288, height:288, borderRadius:"50%",
        background:"linear-gradient(135deg,#fff 0%,#f1f5f9 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"inset 0 4px 24px rgba(0,0,0,0.08)", position:"relative",
        outline:"8px solid rgba(255,255,255,0.5)",
      }}>
        <div style={{ position:"absolute", inset:-24, borderRadius:"50%", border:`1px solid ${color}33`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:-48, borderRadius:"50%", border:`1px solid ${color}1a`, pointerEvents:"none" }}/>
        <span className="material-symbols-outlined" style={{
          position:"absolute", fontSize:220, color:`${color}18`,
          transform:`rotate(${rot}deg)`, userSelect:"none", pointerEvents:"none", lineHeight:1,
        }}>cyclone</span>
        <div style={{
          background:"#fff", borderRadius:24, padding:"28px 28px 20px",
          boxShadow:"0 16px 48px rgba(0,0,0,0.12)", transform:"rotate(-6deg)",
          position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center",
        }}>
          <span className="material-symbols-outlined" style={{
            fontSize:96, color, display:"block", lineHeight:1, transform:`rotate(${rot}deg)`,
          }}>toys_fan</span>
          <div style={{ display:"flex", gap:8, marginTop:16, justifyContent:"center" }}>
            {[color,"#e2e8f0","#e2e8f0"].map((c,i)=>(
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2 — Desk Lamp
function LampVisual({ color }) {
  const [glow, setGlow] = useState(0.6);
  useEffect(() => {
    let dir = 1;
    const id = setInterval(() => {
      setGlow((g) => {
        const next = g + dir * 0.018;
        if (next >= 1) dir = -1;
        if (next <= 0.4) dir = 1;
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"relative", width:288, height:288, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Glow halo */}
        <div style={{
          position:"absolute", width:200, height:200, borderRadius:"50%",
          background:`radial-gradient(circle, ${color}${Math.round(glow*80).toString(16).padStart(2,"0")} 0%, transparent 70%)`,
          top:"50%", left:"50%", transform:"translate(-50%,-60%)",
          transition:"background .05s",
          pointerEvents:"none",
        }}/>
        {/* Lamp card */}
        <div style={{
          background:"#fff", borderRadius:24, padding:40,
          boxShadow:`0 16px 48px rgba(0,0,0,0.1), 0 0 60px ${color}${Math.round(glow*60).toString(16).padStart(2,"0")}`,
          display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:2,
          transition:"box-shadow .05s",
        }}>
          <span className="material-symbols-outlined" style={{
            fontSize:96, color:`rgba(245,158,11,${glow})`,
            filter:`drop-shadow(0 0 ${Math.round(glow*16)}px ${color})`,
            display:"block", lineHeight:1,
          }}>table_lamp</span>
          <div style={{ marginTop:12, fontSize:12, fontWeight:700, color, opacity: glow }}>STANDBY</div>
        </div>
        {/* Cone of light */}
        <div style={{
          position:"absolute", bottom:0, left:"50%",
          transform:"translateX(-50%)",
          width:180, height:80,
          background:`linear-gradient(to bottom, ${color}${Math.round(glow*40).toString(16).padStart(2,"0")}, transparent)`,
          clipPath:"polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
          borderRadius:"0 0 50% 50%",
          pointerEvents:"none",
        }}/>
      </div>
    </div>
  );
}

// 3 — Living Room (Offline)
function OfflineVisual({ color }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"relative", width:288, height:288, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Static rings */}
        {[1,2,3].map((r) => (
          <div key={r} style={{
            position:"absolute", borderRadius:"50%",
            width: r*90, height: r*90,
            border:`1px dashed ${color}${r===1?"66":"33"}`,
            animation:`ww-spin-${r%2===0?"rev":"fwd"} ${6+r*2}s linear infinite`,
          }}/>
        ))}
        <div style={{
          background:"#fff", borderRadius:24, padding:40,
          boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
          display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:2,
          opacity: blink ? 0.5 : 1, transition:"opacity .4s",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize:96, color, display:"block", lineHeight:1 }}>
            lightbulb
          </span>
          <div style={{ marginTop:12, fontSize:12, fontWeight:800, color:"#ef4444", letterSpacing:2 }}>OFFLINE</div>
        </div>
      </div>
    </div>
  );
}

// 4 — Smart TV
function TVVisual({ color }) {
  const [scanLine, setScanLine] = useState(0);
  const [pixels,   setPixels]   = useState(() => Array.from({length:20}, () => Math.random()));
  useEffect(() => {
    const id = setInterval(() => {
      setScanLine((s) => (s + 4) % 100);
      setPixels(Array.from({length:20}, () => Math.random()));
    }, 50);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"relative", width:288, height:288, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* TV card */}
        <div style={{
          background:"#1e1b4b", borderRadius:24, padding:24,
          boxShadow:`0 16px 48px rgba(0,0,0,0.25), 0 0 40px ${color}33`,
          position:"relative", zIndex:2, overflow:"hidden", width:240,
        }}>
          {/* Screen */}
          <div style={{
            width:"100%", height:130, borderRadius:12,
            background:"#0f0a2e", position:"relative", overflow:"hidden",
            border:`2px solid ${color}44`,
          }}>
            {/* Pixel static */}
            {pixels.map((v,i) => (
              <div key={i} style={{
                position:"absolute",
                left:`${(i%5)*20}%`, top:`${Math.floor(i/5)*25}%`,
                width:"20%", height:"25%",
                background: v > 0.7 ? `${color}${Math.round(v*200).toString(16).padStart(2,"0")}` : "transparent",
                transition:"background .05s",
              }}/>
            ))}
            {/* Scan line */}
            <div style={{
              position:"absolute", left:0, right:0, height:2,
              top:`${scanLine}%`,
              background:`linear-gradient(90deg, transparent, ${color}cc, transparent)`,
            }}/>
            <span className="material-symbols-outlined" style={{
              position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              fontSize:48, color:`${color}88`,
            }}>play_circle</span>
          </div>
          {/* TV stand */}
          <div style={{ display:"flex", justifyContent:"center", marginTop:12, gap:8 }}>
            {[color,"#4c1d95","#6d28d9"].map((c,i)=>(
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5 — Fridge
function FridgeVisual({ color }) {
  const [frost,    setFrost]    = useState(0);
  const [dropY,    setDropY]    = useState(-10);
  const [snowflakes, setSnow]   = useState(() => Array.from({length:6},(_,i)=>({ x:15+i*14, y:Math.random()*80, size:8+Math.random()*8 })));
  useEffect(() => {
    const id = setInterval(() => {
      setFrost((f) => (f >= 1 ? 0 : f + 0.008));
      setDropY((d) => (d > 110 ? -10 : d + 0.6));
      setSnow((s) => s.map((sf) => ({ ...sf, y: sf.y > 90 ? -10 : sf.y + 0.3 })));
    }, 30);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"relative", width:288, height:288, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Cold aura */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"50%",
          background:`radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          animation:"ww-pulse-slow 3s ease-in-out infinite",
          pointerEvents:"none",
        }}/>
        {/* Fridge card */}
        <div style={{
          background:"linear-gradient(135deg,#ecfeff,#e0f2fe)",
          borderRadius:24, padding:24,
          boxShadow:`0 16px 48px rgba(0,0,0,0.1), 0 0 32px ${color}44`,
          position:"relative", zIndex:2, overflow:"hidden", width:200, height:220,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          border:`2px solid ${color}44`,
        }}>
          {/* Snowflakes */}
          {snowflakes.map((sf,i) => (
            <span key={i} className="material-symbols-outlined" style={{
              position:"absolute", left:`${sf.x}%`, top:`${sf.y}%`,
              fontSize:sf.size, color:`${color}99`, pointerEvents:"none",
              transform:"translateX(-50%)",
            }}>ac_unit</span>
          ))}
          {/* Main icon */}
          <span className="material-symbols-outlined" style={{
            fontSize:72, color, display:"block", lineHeight:1, position:"relative", zIndex:1,
          }}>kitchen</span>
          {/* Temp badge */}
          <div style={{
            marginTop:12, padding:"4px 16px", borderRadius:999,
            background:`${color}22`, color, fontWeight:800, fontSize:14,
            position:"relative", zIndex:1,
          }}>4°C</div>
          {/* Frost overlay */}
          <div style={{
            position:"absolute", inset:0, borderRadius:22,
            background:`linear-gradient(to bottom, ${color}${Math.round(frost*30).toString(16).padStart(2,"0")}, transparent)`,
            pointerEvents:"none",
          }}/>
          {/* Water drop */}
          <span className="material-symbols-outlined" style={{
            position:"absolute", left:"40%", top:`${dropY}%`,
            fontSize:16, color:`${color}bb`, pointerEvents:"none",
          }}>water_drop</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Chart
───────────────────────────────────────────── */
const INIT_BARS = [30, 45, 40, 65, 55, 35, 70, 50, 25, 60, 40, 85, 65, 50, 30, 75, 45, 95];
const SPARK     = [20, 45, 30, 65, 100, 60];

function hexAlpha(hex, pct) {
  return hex + Math.round((pct / 100) * 0.9 * 255).toString(16).padStart(2, "0");
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function DeviceAnalytics() {
  const [sel,     setSel]     = useState(0);
  const [mounted, setMounted] = useState(false);
  const [bars,    setBars]    = useState(INIT_BARS);
  const [prevSel, setPrevSel] = useState(0);
  const [cardAnim, setCardAnim] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const id = setInterval(
      () => setBars((p) => [...p.slice(1), 20 + Math.floor(Math.random() * 75)]),
      1200
    );
    return () => clearInterval(id);
  }, []);

  // Animate card out/in on device change
  const handleSelect = (i) => {
    if (i === sel) return;
    setCardAnim(true);
    setTimeout(() => { setSel(i); setCardAnim(false); }, 260);
    setPrevSel(sel);
  };

  const dev = DEVICES[sel];
  const COLOR = dev.color;

  const fu = (delay = 0) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
  });

  const cardStyle = {
    opacity:    cardAnim ? 0 : 1,
    transform:  cardAnim ? "translateY(12px) scale(0.98)" : "translateY(0) scale(1)",
    transition: "opacity .26s ease, transform .26s ease",
  };

  const statCard = {
    padding:24, borderRadius:24, background:"#fff",
    border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
  };

  const AnimatedVisual = () => {
    switch (sel) {
      case 0: return <FanVisual    color={COLOR} />;
      case 1: return <LampVisual   color={COLOR} />;
      case 2: return <OfflineVisual color={COLOR} />;
      case 3: return <TVVisual     color={COLOR} />;
      case 4: return <FridgeVisual color={COLOR} />;
      default: return null;
    }
  };

  return (
    <div style={{
      flex:1, overflowY:"auto",
      background:"linear-gradient(135deg,#e0f2fe 0%,#e0e7ff 50%,#f3e8ff 100%)",
      minHeight:"100vh", fontFamily:"Inter,sans-serif",
    }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px 32px", display:"flex", flexDirection:"column", gap:40 }}>

        {/* Title */}
        <div style={{ textAlign:"center", ...fu(0) }}>
          <h1 style={{ fontSize:36, fontWeight:800, letterSpacing:"-0.5px", color:"#0f172a", margin:0 }}>
            WattWise Device Analytics
          </h1>
          <p style={{ color:"#64748b", fontWeight:500, marginTop:6, marginBottom:0 }}>
            Focused Real-time Performance &amp; Telemetry
          </p>
        </div>

        {/* Device Selector */}
        <div style={{ display:"flex", gap:24, overflowX:"auto", paddingBottom:8, justifyContent:"center", ...fu(0.1) }}>
          {DEVICES.map((d, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={{
              flexShrink:0, width:160, padding:"20px 16px", borderRadius:20,
              border:      sel===i ? `2px solid ${d.color}` : "1px solid rgba(255,255,255,0.5)",
              background:  sel===i ? "#fff" : "rgba(255,255,255,0.6)",
              boxShadow:   sel===i ? `0 8px 32px ${d.color}22` : "0 1px 4px rgba(0,0,0,0.06)",
              cursor:"pointer", transition:"all .25s ease", backdropFilter:"blur(12px)",
            }}
              onMouseEnter={e => { if (sel!==i) e.currentTarget.style.transform="scale(1.05)"; }}
              onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{
                position:"relative", width:64, height:64, margin:"0 auto 16px", borderRadius:"50%",
                background: sel===i ? `${d.color}18` : "#f1f5f9",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize:36, color: sel===i ? d.color : "#94a3b8" }}>
                  {d.icon}
                </span>
                {d.active && (
                  <div style={{
                    position:"absolute", top:0, right:0, width:12, height:12,
                    borderRadius:"50%", background:"#22c55e", border:"2px solid #fff",
                  }}/>
                )}
              </div>
              <p style={{ fontSize:14, fontWeight:700, textAlign:"center", color: sel===i ? "#0f172a" : "#334155", margin:0 }}>
                {d.name}
              </p>
              <p style={{ fontSize:10, fontWeight:700, textAlign:"center", letterSpacing:1,
                color: sel===i ? d.color : "#94a3b8", marginTop:4, textTransform:"uppercase" }}>
                {d.status}
              </p>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:32 }}>

          {/* LEFT */}
          <div style={{ gridColumn:"1/span 8", display:"flex", flexDirection:"column", gap:32 }}>

            {/* Performance Card */}
            <div style={{
              borderRadius:40, background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)",
              padding:40, boxShadow:"0 20px 60px rgba(0,0,0,0.08)", border:"1px solid rgba(255,255,255,0.3)",
              position:"relative", overflow:"hidden",
              ...fu(0.2), ...cardStyle,
            }}>
              {/* Color glow — changes with device */}
              <div style={{
                position:"absolute", top:-128, right:-128, width:384, height:384,
                background:`${COLOR}0d`, borderRadius:"50%", filter:"blur(48px)", pointerEvents:"none",
                transition:"background .5s ease",
              }}/>

              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40, position:"relative", zIndex:1 }}>
                <div>
                  <h2 style={{ fontSize:28, fontWeight:800, color:"#0f172a", margin:0, letterSpacing:"-0.5px" }}>
                    Live Performance: {dev.name}
                  </h2>
                  <p style={{ color:"#64748b", marginTop:4, marginBottom:0 }}>
                    Real-time telemetry and energy output
                  </p>
                </div>
                <div style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"8px 20px", borderRadius:999, fontSize:13, fontWeight:700,
                  background: dev.status==="Offline" ? "#fee2e2" : dev.status==="Active Now" ? "#dcfce7" : "#fef9c3",
                  color:      dev.status==="Offline" ? "#dc2626"  : dev.status==="Active Now" ? "#15803d"  : "#92400e",
                  transition:"all .4s ease",
                }}>
                  <div style={{
                    width:10, height:10, borderRadius:"50%",
                    background: dev.status==="Offline" ? "#dc2626" : dev.status==="Active Now" ? "#22c55e" : "#f59e0b",
                    animation: dev.status!=="Offline" ? "ww-pulse 2s infinite" : "none",
                  }}/>
                  {dev.status.toUpperCase()}
                </div>
              </div>

              {/* Visual + Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", position:"relative", zIndex:1 }}>
                <AnimatedVisual />

                {/* Stats */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {/* Power */}
                  <div style={statCard}>
                    <p style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:4, marginTop:0 }}>
                      Current Power
                    </p>
                    <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                      <span style={{ fontSize:30, fontWeight:800, color:"#0f172a" }}>{dev.stats.power}</span>
                      <span style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{dev.stats.powerUnit}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:5, marginTop:16, height:32 }}>
                      {SPARK.map((h,i) => (
                        <div key={i} style={{
                          flex:1, borderRadius:999, height:`${h}%`,
                          background: hexAlpha(COLOR, h),
                          transition:"background .5s ease",
                        }}/>
                      ))}
                    </div>
                  </div>

                  {/* Energy */}
                  <div style={statCard}>
                    <p style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:4, marginTop:0 }}>
                      Energy Today
                    </p>
                    <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                      <span style={{ fontSize:30, fontWeight:800, color:"#0f172a" }}>{dev.stats.energy}</span>
                      <span style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{dev.stats.energyUnit}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:14, color: dev.stats.deltaUp ? "#16a34a" : "#94a3b8" }}>
                        {dev.stats.deltaUp ? "trending_up" : "trending_flat"}
                      </span>
                      <span style={{ fontSize:11, color: dev.stats.deltaUp ? "#16a34a" : "#94a3b8", fontWeight:700 }}>
                        {dev.stats.energyDelta}
                      </span>
                    </div>
                  </div>

                  {/* Mode */}
                  <div style={statCard}>
                    <p style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:4, marginTop:0 }}>
                      Mode
                    </p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:dev.stats.modeBg,
                        display:"flex", alignItems:"center", justifyContent:"center", transition:"background .4s" }}>
                        <span className="material-symbols-outlined" style={{ color:dev.stats.modeColor, fontSize:22, transition:"color .4s" }}>
                          {dev.stats.modeIcon}
                        </span>
                      </div>
                      <span style={{ fontWeight:700, color:"#0f172a" }}>{dev.stats.mode}</span>
                    </div>
                  </div>

                  {/* Health */}
                  <div style={statCard}>
                    <p style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:4, marginTop:0 }}>
                      Health Status
                    </p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:dev.stats.healthBg,
                        display:"flex", alignItems:"center", justifyContent:"center", transition:"background .4s" }}>
                        <span className="material-symbols-outlined" style={{ color:dev.stats.healthColor, fontSize:22, transition:"color .4s" }}>
                          {dev.stats.healthIcon}
                        </span>
                      </div>
                      <span style={{ fontWeight:700, color:"#0f172a" }}>{dev.stats.health}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chart */}
            <div style={{
              borderRadius:28, background:"rgba(255,255,255,0.65)", backdropFilter:"blur(12px)",
              padding:32, border:"1px solid rgba(255,255,255,0.4)", boxShadow:"0 8px 32px rgba(0,0,0,0.06)",
              ...fu(0.35),
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
                <div>
                  <h4 style={{ fontSize:17, fontWeight:700, color:"#0f172a", margin:0 }}>Real-time Wattage Consumption</h4>
                  <p style={{ fontSize:12, color:"#64748b", marginTop:2, marginBottom:0 }}>Last 60 minutes live telemetry</p>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ padding:"4px 14px", fontSize:11, borderRadius:999, background:"#e2e8f0", fontWeight:700, color:"#475569" }}>
                    60 MINS
                  </span>
                  <span style={{ padding:"4px 14px", fontSize:11, borderRadius:999, background:COLOR, color:"#fff", fontWeight:700, animation:"ww-pulse 2s infinite", transition:"background .4s" }}>
                    LIVE
                  </span>
                </div>
              </div>
              <div style={{ height:192, display:"flex", alignItems:"flex-end", gap:10 }}>
                {bars.map((pct,i) => (
                  <div key={i} style={{
                    flex:1, height:`${pct}%`,
                    background: hexAlpha(COLOR, pct),
                    borderRadius:"8px 8px 0 0",
                    transition:"height .6s cubic-bezier(0.34,1.56,0.64,1), background .4s ease",
                    boxShadow: pct > 80 ? `0 4px 16px ${COLOR}33` : "none",
                    minWidth:0,
                  }}/>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ gridColumn:"9/span 4", display:"flex", flexDirection:"column", gap:32 }}>

            {/* Energy Breakdown */}
            <div style={{
              borderRadius:28, background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)",
              padding:32, border:"1px solid rgba(255,255,255,0.4)", boxShadow:"0 12px 40px rgba(0,0,0,0.07)",
              ...fu(0.3),
            }}>
              <h4 style={{ fontSize:17, fontWeight:700, color:"#0f172a", margin:"0 0 28px" }}>Energy Breakdown</h4>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:14, color:"#64748b", fontWeight:500 }}>Total Network Usage</span>
                <span style={{ fontSize:18, fontWeight:800, color:"#0f172a" }}>245 kWh</span>
              </div>
              <div style={{ width:"100%", height:16, borderRadius:999, overflow:"hidden", display:"flex",
                background:"#f1f5f9", boxShadow:"inset 0 1px 3px rgba(0,0,0,0.06)", marginBottom:24 }}>
                {[["45%","#60a5fa"],["25%","#818cf8"],["20%","#22d3ee"],["10%","#cbd5e1"]].map(([w,c],i)=>(
                  <div key={i} style={{ width:w, height:"100%", background:c, boxShadow:i<3?"inset -2px 0 4px rgba(0,0,0,0.1)":"none" }}/>
                ))}
              </div>
              {[
                { color:"#60a5fa", shadow:"#60a5fa80", label:"Fan Usage",  val:"110 kWh" },
                { color:"#818cf8", shadow:"#818cf880", label:"Lamp Usage", val:"61 kWh"  },
                { color:"#22d3ee", shadow:"#22d3ee80", label:"Others",     val:"49 kWh"  },
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 12px", borderRadius:16, marginBottom:4, transition:"background .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:r.color, boxShadow:`0 2px 6px ${r.shadow}` }}/>
                    <span style={{ fontSize:14, fontWeight:600, color:"#475569" }}>{r.label}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{
              borderRadius:28, padding:32, color:"#fff",
              background: COLOR,
              boxShadow:`0 20px 60px ${COLOR}55`, position:"relative", overflow:"hidden",
              transition:"background .4s ease, box-shadow .4s ease",
              ...fu(0.45), ...cardStyle,
            }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160,
                background:"rgba(255,255,255,0.12)", borderRadius:"50%", filter:"blur(24px)", pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20, position:"relative", zIndex:1 }}>
                <div style={{ width:48, height:48, borderRadius:16, background:"rgba(255,255,255,0.2)",
                  backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="material-symbols-outlined" style={{ color:"#fff", fontSize:28 }}>lightbulb</span>
                </div>
                <h4 style={{ fontSize:20, fontWeight:700, margin:0 }}>Smart Insight</h4>
              </div>
              <p style={{ fontSize:15, lineHeight:1.7, opacity:0.92, marginBottom:4, marginTop:0, position:"relative", zIndex:1 }}>
                {sel === 0 && <>Your <b>Smart Fan</b> has been running <b>8 hours</b>. Eco Mode could save you</>}
                {sel === 1 && <>Your <b>Desk Lamp</b> is on standby. Schedule auto-off to save</>}
                {sel === 2 && <>Your <b>Living Room</b> light is offline. Check connection to recover</>}
                {sel === 3 && <>Your <b>Smart TV</b> draws high power. Enabling sleep mode saves</>}
                {sel === 4 && <>Your <b>Fridge</b> is running optimally. Adjusting to 6°C saves</>}
              </p>
              <div style={{ fontSize:36, fontWeight:900, position:"relative", zIndex:1, marginBottom:0 }}>
                {["12%","18%","—","22%","9%"][sel]}
              </div>
              <div style={{ fontSize:12, opacity:0.75, letterSpacing:2, textTransform:"uppercase",
                marginBottom:28, position:"relative", zIndex:1 }}>
                {sel === 2 ? "device unreachable" : "on your weekly bill"}
              </div>
              <button style={{
                width:"100%", padding:16, background:"#fff", color:COLOR,
                fontWeight:800, borderRadius:16, border:"none", cursor:"pointer",
                fontSize:13, letterSpacing:1.5, textTransform:"uppercase",
                transition:"all .2s ease, color .4s ease", position:"relative", zIndex:1,
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}
                onMouseDown ={e=>  e.currentTarget.style.transform="scale(0.97)"}
                onMouseUp   ={e=>  e.currentTarget.style.transform="translateY(-2px)"}
              >
                {["Apply Eco-Schedules","Schedule Auto-Off","Check Connection","Enable Sleep Mode","Optimize Cooling"][sel]}
              </button>
            </div>

            {/* Add Device */}
            <button style={{
              width:"100%", borderRadius:28, border:"2px dashed #cbd5e1",
              padding:"32px 24px", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", textAlign:"center",
              background:"transparent", cursor:"pointer", transition:"all .2s ease",
              ...fu(0.55),
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor=COLOR; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent";           e.currentTarget.style.borderColor="#cbd5e1"; }}
            >
              <div style={{ width:56, height:56, borderRadius:"50%", background:"#f1f5f9",
                display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <span className="material-symbols-outlined" style={{ color:"#94a3b8", fontSize:28 }}>add</span>
              </div>
              <h5 style={{ fontSize:15, fontWeight:700, color:"#334155", margin:0 }}>Add New Device</h5>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:8, maxWidth:200, lineHeight:1.5 }}>
                Connect more smart appliances to expand your ecosystem
              </p>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ww-pulse       { 0%,100%{opacity:1}       50%{opacity:0.4} }
        @keyframes ww-pulse-slow  { 0%,100%{opacity:0.6}     50%{opacity:1}   }
        @keyframes ww-spin-fwd    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ww-spin-rev    { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
      `}</style>
    </div>
  );
}