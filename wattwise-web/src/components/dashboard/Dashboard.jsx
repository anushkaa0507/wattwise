// import { useEffect, useState } from "react";
// import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
// import { io } from "socket.io-client";
// import { fetchDevices, addDevice, toggleDevice } from "./services/deviceApi";

// const BASE_URL = import.meta.env.VITE_API_URL;

// export default function Dashboard() {
//   const { getToken } = useAuth();
//   const { user, isLoaded } = useUser();
//   const [devices, setDevices] = useState([]);
//   const [name, setName] = useState("");
//   const [watt, setWatt] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   /* ---------------- LOAD DEVICES ---------------- */
//   useEffect(() => {
//     const load = async () => {
//       if (!isLoaded || !user) return;
//       const token = await getToken();
//       const data = await fetchDevices(token);
//       setDevices(data || []);
//     };
//     load();
//   }, [isLoaded, user]);

//   /* ---------------- SOCKET ---------------- */
//   useEffect(() => {
//     if (!isLoaded || !user?.id) return;

//     const socket = io(BASE_URL, { transports: ["websocket"] });
//     socket.emit("join", user.id);

//     socket.on("energy-update", (updatedDevices) => {
//       setDevices(updatedDevices);
//     });

//     return () => socket.disconnect();
//   }, [isLoaded, user]);

//   /* ---------------- ADD DEVICE ---------------- */
//   const handleAdd = async () => {
//     if (!name || !watt) return;
//     const token = await getToken();
//     await addDevice(name, Number(watt), token);
//     const data = await fetchDevices(token);
//     setDevices(data);
//     setName("");
//     setWatt("");
//     setShowModal(false);
//   };

//   /* ---------------- TOGGLE ---------------- */
//   const handleToggle = async (id) => {
//     const token = await getToken();
//     await toggleDevice(id, token);
//     const data = await fetchDevices(token);
//     setDevices(data);
//   };

//   /* ---------------- DEVICE COLOR LOGIC ---------------- */
//   const getCardColor = (name) => {
//     if (name.toLowerCase().includes("fan")) return "bg-mint";
//     if (name.toLowerCase().includes("lamp")) return "bg-pale-yellow";
//     if (name.toLowerCase().includes("ac")) return "bg-baby-blue";
//     return "bg-white/60";
//   };

//   return (
//     <div className="flex h-screen font-sans bg-gradient-to-br from-sky-100 to-purple-100">

//       {/* ---------------- SIDEBAR ---------------- */}
//       <aside className="w-72 backdrop-blur-xl bg-white/60 p-8 flex flex-col border-r border-white/40">
//         <div className="flex items-center gap-3 mb-12">
//           <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
//             ⚡
//           </div>
//           <h1 className="text-2xl font-black tracking-tight">WattWise</h1>
//         </div>

//         <nav className="space-y-3 text-slate-600 font-semibold">
//           <div className="bg-white/80 rounded-2xl px-6 py-4 shadow text-slate-800 font-bold">
//             Dashboard
//           </div>
//           <div className="px-6 py-4 hover:bg-white/60 rounded-2xl cursor-pointer">
//             Devices
//           </div>
//         </nav>

//         <div className="mt-auto pt-10">
//           <UserButton afterSignOutUrl="/" />
//         </div>
//       </aside>

//       {/* ---------------- MAIN ---------------- */}
//       <div className="flex-1 overflow-y-auto p-10">

//         {/* HEADER */}
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-4xl font-black tracking-tight mb-2">
//               My Smart Home
//             </h2>
//             <p className="text-slate-500 font-medium">
//               Real-time telemetry active for {devices.length} devices
//             </p>
//           </div>

//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-400/30 transition active:scale-95"
//           >
//             + Add New Device
//           </button>
//         </div>

//         {/* DEVICE GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//           {devices.map((device) => {
//   const name = device.name.toLowerCase();

//   const renderIcon = () => {

//     /* ===== AC ===== */
//     if (name.includes("ac")) {
//       return (
//         <div className="relative w-24 h-24 flex items-center justify-center">
//           <div className="w-20 h-10 bg-white rounded-md shadow-lg relative border border-slate-100 overflow-hidden">
//             <div className="absolute bottom-0 left-0 w-full h-3 bg-slate-50 border-t border-slate-100 ac-vent"></div>

//             {device.is_on && (
//               <>
//                 <div className="absolute -bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full air-particle"></div>
//                 <div className="absolute -bottom-6 left-10 w-1.5 h-1.5 bg-white/30 rounded-full air-particle"></div>
//                 <div className="absolute -bottom-2 left-14 w-1 h-1 bg-white/20 rounded-full air-particle"></div>
//               </>
//             )}
//           </div>
//         </div>
//       );
//     }

//     /* ===== FAN ===== */
//     if (name.includes("fan")) {
//       return (
//         <div className="relative w-24 h-24 flex items-center justify-center fan-container">
//           <div className={`relative flex items-center justify-center ${device.is_on ? "fan-blades" : ""}`}>
//             <div className="w-6 h-6 bg-slate-300 rounded-full border-2 border-white shadow-md relative z-20"></div>
//             <div className="fan-blade" style={{ transform: "rotateZ(0deg) translate(8px,0)" }}></div>
//             <div className="fan-blade" style={{ transform: "rotateZ(120deg) translate(8px,0)" }}></div>
//             <div className="fan-blade" style={{ transform: "rotateZ(240deg) translate(8px,0)" }}></div>
//           </div>
//         </div>
//       );
//     }

//     /* ===== LAMP ===== */
//     if (name.includes("lamp")) {
//       return (
//         <div className="relative w-24 h-24 flex items-center justify-center">
//           {device.is_on && (
//             <div className="absolute inset-0 lamp-glow-effect opacity-40"></div>
//           )}
//           <div className="relative flex flex-col items-center">
//             <div className="w-12 h-2 bg-slate-400 rounded-full mb-1"></div>
//             <div className="w-1 h-12 bg-slate-300"></div>
//             <div className="w-14 h-8 bg-slate-200 rounded-t-full relative -mt-1 lamp-head border border-slate-300"></div>
//           </div>
//         </div>
//       );
//     }

//     return <div className="text-4xl">🔌</div>;
//   };

//   return (
//     <div
//       key={device.id}
//       className="bg-white/60 rounded-[2.5rem] p-8 border border-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all flex flex-col"
//     >
//       <div className="flex justify-between items-start mb-6">
//         {renderIcon()}

//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={device.is_on}
//             onChange={() => handleToggle(device.id)}
//             className="sr-only peer"
//           />
//           <div className="w-14 h-7 bg-white/40 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
//         </label>
//       </div>

//       <h4 className="text-2xl font-black text-slate-800 mb-6">
//         {device.name}
//       </h4>

//       <div className="mt-auto bg-white/50 rounded-2xl p-4 flex justify-between border border-white/20">
//         <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">
//           Live Watts
//         </span>

//         <span className="font-black text-xl text-orange-500">
//           {device.is_on ? `${device.power_rating} W` : "0 W"}
//         </span>
//       </div>
//     </div>
//   );
// })}
//         </div>
//       </div>

//       {/* ---------------- MODAL ---------------- */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-6 z-50">
//           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10">

//             <div className="flex justify-between items-center mb-10">
//               <h3 className="text-3xl font-black">Add New Device</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-slate-500 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-6">
//               <input
//                 className="w-full bg-slate-100 rounded-3xl px-6 py-5 outline-none focus:ring-4 focus:ring-orange-200"
//                 placeholder="Device Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />

//               <input
//                 className="w-full bg-slate-100 rounded-3xl px-6 py-5 outline-none focus:ring-4 focus:ring-orange-200"
//                 placeholder="Watt Rating"
//                 value={watt}
//                 onChange={(e) => setWatt(e.target.value)}
//               />

//               <button
//                 onClick={handleAdd}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-3xl shadow-xl transition active:scale-95"
//               >
//                 Register Device
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// Dashboard.jsx — WattWise Enhanced UI
// Exact animated device cards from design + original Clerk/socket/API logic intact

import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { fetchDevices, addDevice, toggleDevice } from "../../../services/deviceApi";

const BASE_URL = import.meta.env.VITE_API_URL;

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { font-family: 'Inter', sans-serif; }

  .ww-bg { background: linear-gradient(135deg, #e0f2fe 0%, #ede9fe 100%); }
  .ww-frosted {
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(255,255,255,0.3);
  }
  .ww-header {
    background: rgba(255,255,255,0.4);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.3);
  }

  @keyframes fan-spin {
    from { transform: rotateX(60deg) rotateZ(0deg); }
    to   { transform: rotateX(60deg) rotateZ(360deg); }
  }
  .fan-blades { transform-style: preserve-3d; animation: fan-spin 2s linear infinite; }
  .fan-blades-fast { animation: fan-spin 0.5s linear infinite !important; }
  .fan-blade {
    position: absolute;
    width: 60px; height: 15px;
    background: linear-gradient(to right, #94a3b8, #cbd5e1);
    border-radius: 40% 10% 10% 40%;
    transform-origin: left center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }

  @keyframes lamp-tilt {
    0%,100% { transform: rotate(-5deg); }
    50%      { transform: rotate(10deg); }
  }
  .lamp-head { transform-origin: bottom center; animation: lamp-tilt 4s ease-in-out infinite; }

  @keyframes vent-move {
    0%,100% { transform: rotateX(0deg); }
    50%      { transform: rotateX(45deg); }
  }
  .ac-vent { animation: vent-move 3s ease-in-out infinite; transform-origin: top; }

  @keyframes particle-flow {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    20%  { opacity: 0.4; }
    100% { transform: translateY(40px) translateX(10px) scale(1.5); opacity: 0; }
  }
  .air-particle { animation: particle-flow 2s linear infinite; }

  @keyframes pulse-stream {
    0%,100% { transform: scale(1);   opacity: 1;   }
    50%      { transform: scale(1.5); opacity: 0.4; }
  }
  .pulse-dot { animation: pulse-stream 1.5s ease-in-out infinite; }

  .toggle-track {
    position: relative; display: inline-flex; align-items: center;
    width: 56px; height: 28px; border-radius: 9999px;
    transition: background 0.2s; cursor: pointer;
  }
  .toggle-thumb {
    position: absolute; top: 4px; left: 4px;
    width: 20px; height: 20px; border-radius: 9999px;
    background: white; transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .toggle-on .toggle-thumb { transform: translateX(28px); }

  .device-card { transition: box-shadow 0.2s, transform 0.2s; }
  .device-card:hover { transform: translateY(-2px); }
`;

function injectStyles() {
  if (document.getElementById("ww-styles")) return;
  const s = document.createElement("style");
  s.id = "ww-styles";
  s.textContent = GLOBAL_STYLES;
  document.head.appendChild(s);
}

function detectType(name = "") {
  const n = name.toLowerCase();
  if (n.includes("fan"))    return "fan";
  if (n.includes("ac") || n.includes("air") || n.includes("cool")) return "ac";
  if (n.includes("lamp") || n.includes("light") || n.includes("bulb")) return "lamp";
  if (n.includes("fridge") || n.includes("refrigerator")) return "fridge";
  return "other";
}

function Toggle({ checked, onChange, color = "#0ea5e9" }) {
  return (
    <div
      className={`toggle-track ${checked ? "toggle-on" : ""}`}
      style={{ background: checked ? color : "rgba(200,200,200,0.5)", border: "1px solid rgba(255,255,255,0.3)" }}
      onClick={onChange}
    >
      <div className="toggle-thumb" />
    </div>
  );
}

function Sparkline({ stroke }) {
  const paths = {
    "#0ea5e9": "M0,30 Q25,10 50,25 T100,20 T150,35 T200,15",
    "#10b981": "M0,20 L20,22 L40,18 L60,25 L80,15 L100,28 L120,12 L140,24 L160,20 L180,26 L200,15",
    "#d97706": "M0,20 L20,20 L40,20 L60,20 L80,21 L100,19 L120,20 L140,20 L160,20 L180,20 L200,20",
  };
  const d = paths[stroke] || paths["#0ea5e9"];
  return (
    <div style={{ height: 40, width: "100%", opacity: 0.6, marginBottom: 16 }}>
      <svg width="100%" height="100%" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    </div>
  );
}

function LiveWatts({ value, color, dotColor }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.5)",
      borderRadius: "1rem",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="pulse-dot" style={{
          width: 10, height: 10, borderRadius: "50%",
          background: dotColor, display: "inline-block"
        }} />
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
          Live Watts
        </span>
      </div>
      <span style={{ color, fontWeight: 900, fontSize: 20 }}>{value}</span>
    </div>
  );
}

function ACCard({ device, onToggle }) {
  const watts = device.is_on ? `${device.power_rating} W` : "0 W";
  return (
    <div className="device-card" style={{
      background: "#e0f2fe", borderRadius: "2.5rem", padding: 32,
      border: "1px solid rgba(255,255,255,0.4)",
      display: "flex", flexDirection: "column", cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 80, height: 40, background: "white", borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "relative",
            overflow: "hidden", border: "1px solid #f1f5f9",
          }}>
            <div style={{ position: "absolute", top: 4, left: 8, width: 12, height: 2, background: "#e2e8f0", borderRadius: 2 }} />
            <div className="ac-vent" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 12, background: "#f8fafc", borderTop: "1px solid #e2e8f0" }} />
            <div className="air-particle" style={{ position: "absolute", bottom: -16, left: 16, width: 4, height: 4, background: "rgba(14,165,233,0.3)", borderRadius: "50%" }} />
            <div className="air-particle" style={{ position: "absolute", bottom: -24, left: 40, width: 6, height: 6, background: "rgba(14,165,233,0.2)", borderRadius: "50%", animationDelay: "0.5s" }} />
            <div className="air-particle" style={{ position: "absolute", bottom: -8, left: 56, width: 4, height: 4, background: "rgba(14,165,233,0.15)", borderRadius: "50%", animationDelay: "1.2s" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select style={{ background: "rgba(255,255,255,0.4)", border: "none", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 8, padding: "4px 8px", outline: "none", cursor: "pointer" }}>
            <option>Turbo</option>
            <option defaultValue>Eco</option>
            <option>Sleep</option>
          </select>
          <Toggle checked={device.is_on} onChange={() => onToggle(device.id)} color="#0ea5e9" />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: "0 0 4px" }}>{device.name}</h4>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{device.room || "Living Area"}</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.3)", borderRadius: "1rem", padding: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 4px" }}>Ambient</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", margin: 0 }}>22°C</p>
        </div>
        <div style={{ flex: 1, background: "rgba(14,165,233,0.1)", borderRadius: "1rem", padding: 12, border: "1px solid #bae6fd" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", margin: "0 0 4px" }}>Target</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#0284c7", margin: 0 }}>20°C</p>
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Sparkline stroke="#0ea5e9" />
        <LiveWatts value={watts} color="#0284c7" dotColor="#0ea5e9" />
      </div>
    </div>
  );
}

function FanCard({ device, onToggle }) {
  const watts = device.is_on ? `${device.power_rating} W` : "0 W";
  return (
    <div className="device-card" style={{
      background: "#dcfce7", borderRadius: "2.5rem", padding: 32,
      border: "1px solid rgba(255,255,255,0.4)",
      display: "flex", flexDirection: "column", cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div
  style={{
    position: "relative",
    width: 90,
    height: 90,
  }}
>
  {/* CENTER WRAPPER (handles positioning ONLY) */}
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 80,
      height: 80,
    }}
  >
    {/* ROTATING LAYER (handles animation ONLY) */}
    <div
      style={{
        width: "100%",
        height: "100%",
        animation: device.is_on ? "fan-spin 0.7s linear infinite" : "none",
      }}
    >
        <div className="fan-blade" style={{ transform: "rotate(0deg)" }} />
        <div className="fan-blade" style={{ transform: "rotate(120deg)" }} />
        <div className="fan-blade" style={{ transform: "rotate(240deg)" }} />
    </div>
  </div>
</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 8, padding: 4 }}>
            <button style={{ padding: "4px 8px", fontSize: 9, fontWeight: 700, color: "#065f46", background: "transparent", border: "none", cursor: "pointer" }}>LOW</button>
            <button style={{ padding: "4px 8px", fontSize: 9, fontWeight: 700, color: "#059669", background: "white", borderRadius: 6, border: "none", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>HI</button>
          </div>
          <Toggle checked={device.is_on} onChange={() => onToggle(device.id)} color="#10b981" />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: "0 0 4px" }}>{device.name}</h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{device.room || "Master Suite"}</p>
          <span style={{ fontSize: 10, fontWeight: 900, background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: 9999 }}>1240 RPM</span>
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Sparkline stroke="#10b981" />
        <LiveWatts value={watts} color="#059669" dotColor="#10b981" />
      </div>
    </div>
  );
}

function LampCard({ device, onToggle }) {
  const watts = device.is_on ? `${device.power_rating} W` : "0 W";
  return (
    <div className="device-card" style={{
      background: "#fef9c3", borderRadius: "2.5rem", padding: 32,
      border: "1px solid rgba(255,255,255,0.4)",
      display: "flex", flexDirection: "column", cursor: "pointer",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0) 70%)",
        opacity: device.is_on ? 0.5 : 0.15, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 48, height: 8, background: "#94a3b8", borderRadius: 4, marginBottom: 4 }} />
            <div style={{ width: 4, height: 40, background: "#cbd5e1" }} />
            <div className="lamp-head" style={{ width: 56, height: 30, background: "#e2e8f0", borderRadius: "50% 50% 0 0", marginTop: -4, border: "1px solid #cbd5e1", position: "relative" }}>
              {device.is_on && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "rgba(251,191,36,0.5)", filter: "blur(4px)" }} />}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.4)", borderRadius: 8, padding: 4, gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#d97706" }}>light_mode</span>
            <input type="range" style={{ width: 48, accentColor: "#f59e0b", opacity: 0.7 }} />
          </div>
          <Toggle checked={device.is_on} onChange={() => onToggle(device.id)} color="#f59e0b" />
        </div>
      </div>
      <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
        <h4 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: "0 0 4px" }}>{device.name}</h4>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{device.room || "Workspace"}</p>
      </div>
      <div style={{ marginTop: "auto", position: "relative", zIndex: 1 }}>
        <Sparkline stroke="#d97706" />
        <LiveWatts value={watts} color="#d97706" dotColor="#f59e0b" />
      </div>
    </div>
  );
}

function GenericCard({ device, onToggle }) {
  const watts = device.is_on ? `${device.power_rating} W` : "0 W";
  const type = detectType(device.name);
  const icon = type === "fridge" ? "kitchen" : "electrical_services";
  return (
    <div className="device-card" style={{
      background: "#e0f2fe", borderRadius: "2.5rem", padding: 32,
      border: "1px solid rgba(255,255,255,0.4)",
      display: "flex", flexDirection: "column", cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, background: "rgba(255,255,255,0.6)",
          borderRadius: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0284c7", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36 }}>{icon}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "rgba(255,255,255,0.4)", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>Normal</button>
          <Toggle checked={device.is_on} onChange={() => onToggle(device.id)} color="#0ea5e9" />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: "0 0 4px" }}>{device.name}</h4>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{device.room || "Kitchen"}</p>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Sparkline stroke="#0ea5e9" />
        <LiveWatts value={watts} color="#0284c7" dotColor="#0ea5e9" />
      </div>
    </div>
  );
}

function DeviceCard({ device, onToggle }) {
  const type = detectType(device.name);
  if (type === "ac")   return <ACCard   device={device} onToggle={onToggle} />;
  if (type === "fan")  return <FanCard  device={device} onToggle={onToggle} />;
  if (type === "lamp") return <LampCard device={device} onToggle={onToggle} />;
  return <GenericCard device={device} onToggle={onToggle} />;
}

function AddDeviceModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const deviceTypes = [
    { key: "fan",   icon: "mode_fan",   label: "Fan",   bg: "#dcfce7", color: "#059669" },
    { key: "lamp",  icon: "table_lamp", label: "Lamp",  bg: "#fef9c3", color: "#d97706" },
    { key: "ac",    icon: "ac_unit",    label: "AC",    bg: "#e0f2fe", color: "#0284c7" },
    { key: "other", icon: "more_horiz", label: "Other", bg: "#f8fafc", color: "#64748b" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", width: "100%", maxWidth: 480, borderRadius: "3rem", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        <div style={{ padding: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h3 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: 0 }}>Add New Device</h3>
            <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Device Name</label>
            <input
              style={{ width: "100%", background: "#f8fafc", border: "2px solid transparent", borderRadius: "1.5rem", padding: "16px 24px", fontSize: 15, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
              placeholder="e.g. Master Bedroom Fan"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Watt Rating</label>
            <input
              style={{ width: "100%", background: "#f8fafc", border: "2px solid transparent", borderRadius: "1.5rem", padding: "16px 24px", fontSize: 15, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
              placeholder="e.g. 45"
              value={watt}
              onChange={e => setWatt(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Device Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {deviceTypes.map(t => (
                <button key={t.key} onClick={() => setSelectedType(t.key)} style={{
                  aspectRatio: "1", borderRadius: "1.5rem",
                  background: selectedType === t.key ? t.bg : t.bg + "80",
                  border: selectedType === t.key ? `2px solid ${t.color}` : "2px solid transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, cursor: "pointer", transition: "all 0.15s", color: t.color,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{t.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onAdd(name, watt)}
            style={{ width: "100%", background: "#ee5b2b", color: "white", border: "none", borderRadius: "1.5rem", padding: "20px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 12px 28px rgba(238,91,43,0.25)" }}
          >
            Register Device
          </button>
        </div>
        <div style={{ background: "#f8fafc", padding: "24px 32px", display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid #f1f5f9" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: "#38bdf8", fontSize: 20 }}>wifi</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            Ensure your device is in pairing mode. WattWise will scan for signals automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [devices, setDevices]     = useState([]);
  const [showModal, setShowModal] = useState(false);

  injectStyles();

  useEffect(() => {
    const load = async () => {
      if (!isLoaded || !user) return;
      const token = await getToken();
      if (!token) { console.error("No auth token"); return; }
      try {
        const data = await fetchDevices(token);
        setDevices(data || []);
      } catch (err) {
        console.error("Fetch devices failed:", err);
      }
    };
    load();
  }, [isLoaded, user, getToken]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socket.emit("join", user.id);
    socket.on("energy-update", (updatedDevices) => setDevices(updatedDevices));
    return () => socket.disconnect();
  }, [isLoaded, user]);

  const handleAdd = async (name, watt) => {
    if (!name || !watt) return;
    try {
      const token = await getToken();
      await addDevice(name, Number(watt), token);
      setShowModal(false);
      const data = await fetchDevices(token);
      setDevices(data);
    } catch (err) {
      console.error("Add device failed:", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const token = await getToken();
      await toggleDevice(id, token);
      const data = await fetchDevices(token);
      setDevices(data);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  return (
    <div className="ww-bg" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <aside className="ww-frosted" style={{ width: 272, flexShrink: 0, display: "flex", flexDirection: "column", zIndex: 20 }}>
        <div style={{ padding: "32px 32px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "#ee5b2b", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 8px 20px rgba(238,91,43,0.25)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, fontWeight: 700 }}>bolt</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>WattWise</h1>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { icon: "dashboard",      label: "Dashboard",    color: "#38bdf8", active: true  },
            { icon: "devices",        label: "Devices",      color: "#34d399", active: false },
            { icon: "analytics",      label: "Energy Stats", color: "#fbbf24", active: false },
            { icon: "calendar_today", label: "Schedules",    color: "#818cf8", active: false },
            { icon: "settings",       label: "Settings",     color: "#94a3b8", active: false },
          ].map(item => (
            <a key={item.label} href="#" style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 24px", borderRadius: "1rem",
              background: item.active ? "rgba(255,255,255,0.6)" : "transparent",
              color: item.active ? "#1e293b" : "#64748b",
              fontWeight: item.active ? 700 : 500,
              textDecoration: "none",
              boxShadow: item.active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = "rgba(255,255,255,0.4)" }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = "transparent" }}
            >
              <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: 24 }}>
          <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: "1.5rem", padding: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Usage Limit</p>
            <div style={{ width: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 9999, height: 8, marginBottom: 12 }}>
              <div style={{ width: "65%", height: 8, background: "#ee5b2b", borderRadius: 9999 }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#475569", margin: 0 }}>65% of monthly goal</p>
          </div>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* HEADER */}
        <header className="ww-header" style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#38bdf8", fontSize: 20 }}>search</span>
            <input
              style={{ width: "100%", background: "rgba(255,255,255,0.6)", border: "2px solid #e0f2fe", borderRadius: "1rem", paddingLeft: 48, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: "#1e293b", outline: "none", boxSizing: "border-box" }}
              placeholder="Search devices or rooms..."
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button style={{ position: "relative", width: 44, height: 44, borderRadius: "0.75rem", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}>
              <span className="material-symbols-outlined">notifications</span>
              <span style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, background: "#ee5b2b", border: "2px solid white", borderRadius: "50%" }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 20, borderLeft: "1px solid rgba(255,255,255,0.4)" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>{user?.firstName} {user?.lastName}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Home Owner</p>
              </div>
              <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main style={{ flex: 1, overflowY: "auto", padding: 40 }}>
          {/* Title */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.03em" }}>My Smart Home</h2>
              <p style={{ color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 8, margin: 0, fontSize: 14 }}>
                <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                Real-time telemetry active for {devices.length} devices
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{ background: "#ee5b2b", color: "white", border: "none", borderRadius: "1rem", padding: "16px 32px", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 12px 28px rgba(238,91,43,0.3)", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <span className="material-symbols-outlined">add</span>
              Add New Device
            </button>
          </div>

          {/* Device grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 32, marginBottom: 48 }}>
            {devices.map(device => (
              <DeviceCard key={device.id} device={device} onToggle={handleToggle} />
            ))}
          </div>

          {/* Bottom panels */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {/* Energy Trend */}
            <div style={{ flex: 1, minWidth: 300, background: "rgba(255,255,255,0.3)", borderRadius: "1.5rem", padding: 32, border: "1px solid rgba(255,255,255,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h5 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: 0 }}>Aggregate Energy Trend</h5>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#ee5b2b", background: "rgba(238,91,43,0.1)", padding: "4px 10px", borderRadius: 9999, textTransform: "uppercase" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>trending_up</span>
                  Live Now
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
                {[40, 65, 45, 85, 30, 55, 70].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 3 ? "#ee5b2b" : "rgba(14,165,233,0.35)", borderRadius: "4px 4px 0 0", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => { if (i !== 3) e.currentTarget.style.background = "rgba(14,165,233,0.55)" }}
                    onMouseLeave={e => { if (i !== 3) e.currentTarget.style.background = "rgba(14,165,233,0.35)" }}
                  >
                    {i === 3 && <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 900, color: "#ee5b2b" }}>Peak</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Device Clusters */}
            <div style={{ width: 340, background: "rgba(255,255,255,0.3)", borderRadius: "1.5rem", padding: 32, border: "1px solid rgba(255,255,255,0.3)" }}>
              <h5 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: "0 0 24px" }}>Device Clusters</h5>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: "bedtime", label: "Sleep Mode", color: "#0ea5e9" },
                  { icon: "home",    label: "Away Mode",  color: "#f97316" },
                ].map(c => (
                  <button key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(255,255,255,0.6)", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", gap: 8, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <span className="material-symbols-outlined" style={{ color: c.color, fontSize: 24 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && <AddDeviceModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}