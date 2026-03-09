import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import {
  fetchDevices,
  addDevice,
  toggleDevice,
} from "../../../services/deviceApi";
import "./dashboard.css";
const BASE_URL = import.meta.env.VITE_API_URL;



function detectType(name = "") {
  const n = name.toLowerCase();
  if (n.includes("fan")) return "fan";
  if (n.includes("ac") || n.includes("air") || n.includes("cool")) return "ac";
  if (n.includes("lamp") || n.includes("light") || n.includes("bulb"))
    return "lamp";
  if (n.includes("fridge") || n.includes("refrigerator")) return "fridge";
  return "other";
}

function Toggle({ checked, onChange, color = "#0ea5e9" }) {
  return (
    <div
      className={`toggle-track ${checked ? "toggle-on" : ""}`}
      style={{
        background: checked ? color : "rgba(200,200,200,0.5)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
      onClick={onChange}
    >
      <div className="toggle-thumb" />
    </div>
  );
}

function Sparkline({ stroke }) {
  const paths = {
    "#0ea5e9": "M0,30 Q25,10 50,25 T100,20 T150,35 T200,15",
    "#10b981":
      "M0,20 L20,22 L40,18 L60,25 L80,15 L100,28 L120,12 L140,24 L160,20 L180,26 L200,15",
    "#d97706":
      "M0,20 L20,20 L40,20 L60,20 L80,21 L100,19 L120,20 L140,20 L160,20 L180,20 L200,20",
  };
  const d = paths[stroke] || paths["#0ea5e9"];
  return (
    <div style={{ height: 40, width: "100%", opacity: 0.6, marginBottom: 16 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
      >
        <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    </div>
  );
}

function LiveWatts({ value, color, dotColor }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.5)",
        borderRadius: "1rem",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          className="pulse-dot"
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: dotColor,
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#64748b",
          }}
        >
          Live Watts
        </span>
      </div>
      <span style={{ color, fontWeight: 900, fontSize: 20 }}>{value}</span>
    </div>
  );
}

function ACCard({ device, onToggle }) {
  const [liveEnergy, setLiveEnergy] = useState(
    Number(device.total_energy || 0),
  );
  useEffect(() => {
    let interval;

    if (device.is_on && device.start_time) {
      interval = setInterval(() => {
        const seconds =
          (Date.now() - new Date(device.start_time).getTime()) / 1000;

        const hours = seconds / 3600;

        const energy =
          Number(device.total_energy || 0) +
          (device.power_rating * hours) / 1000;

        setLiveEnergy(energy);
      }, 1000);
    } else {
      setLiveEnergy(Number(device.total_energy || 0));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    device.is_on,
    device.start_time,
    device.total_energy,
    device.power_rating,
  ]);

  const watts = device.is_on
    ? `${device.power_rating} W`
    : `${liveEnergy.toFixed(3)} kWh`;
  return (
    <div
      className="device-card"
      style={{
        background: "#e0f2fe",
        borderRadius: "2.5rem",
        padding: 32,
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 40,
              background: "white",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 8,
                width: 12,
                height: 2,
                background: "#e2e8f0",
                borderRadius: 2,
              }}
            />
            <div
              className="ac-vent"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 12,
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
              }}
            />
            <div
              className="air-particle"
              style={{
                position: "absolute",
                bottom: -16,
                left: 16,
                width: 4,
                height: 4,
                background: "rgba(14,165,233,0.3)",
                borderRadius: "50%",
              }}
            />
            <div
              className="air-particle"
              style={{
                position: "absolute",
                bottom: -24,
                left: 40,
                width: 6,
                height: 6,
                background: "rgba(14,165,233,0.2)",
                borderRadius: "50%",
                animationDelay: "0.5s",
              }}
            />
            <div
              className="air-particle"
              style={{
                position: "absolute",
                bottom: -8,
                left: 56,
                width: 4,
                height: 4,
                background: "rgba(14,165,233,0.15)",
                borderRadius: "50%",
                animationDelay: "1.2s",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select
            style={{
              background: "rgba(255,255,255,0.4)",
              border: "none",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              borderRadius: 8,
              padding: "4px 8px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option>Turbo</option>
            <option defaultValue>Eco</option>
            <option>Sleep</option>
          </select>
          <Toggle
            checked={device.is_on}
            onChange={() => onToggle(device.id)}
            color="#0ea5e9"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#1e293b",
            margin: "0 0 4px",
          }}
        >
          {device.name}
        </h4>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          {device.room || "Living Area"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.3)",
            borderRadius: "1rem",
            padding: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}
          >
            Ambient
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#1e293b",
              margin: 0,
            }}
          >
            22°C
          </p>
        </div>
        <div
          style={{
            flex: 1,
            background: "rgba(14,165,233,0.1)",
            borderRadius: "1rem",
            padding: 12,
            border: "1px solid #bae6fd",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#0284c7",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}
          >
            Target
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#0284c7",
              margin: 0,
            }}
          >
            20°C
          </p>
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
  const [liveEnergy, setLiveEnergy] = useState(
    Number(device.total_energy || 0),
  );

  useEffect(() => {
    let interval;

    if (device.is_on && device.start_time) {
      interval = setInterval(() => {
        const seconds =
          (Date.now() - new Date(device.start_time).getTime()) / 1000;

        const hours = seconds / 3600;

        const energy =
          Number(device.total_energy || 0) +
          (device.power_rating * hours) / 1000;

        setLiveEnergy(energy);
      }, 1000);
    } else {
      setLiveEnergy(Number(device.total_energy || 0));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    device.is_on,
    device.start_time,
    device.total_energy,
    device.power_rating,
  ]);

  const watts = device.is_on
    ? `${device.power_rating} W`
    : `${liveEnergy.toFixed(3)} kWh`;
  return (
    <div
      className="device-card"
      style={{
        background: "#dcfce7",
        borderRadius: "2.5rem",
        padding: 32,
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 90,
            height: 90,
          }}
        >
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
            <div
              style={{
                width: "100%",
                height: "100%",
                animation: device.is_on
                  ? "fan-spin 0.7s linear infinite"
                  : "none",
              }}
            >
              <div
                className="fan-blade"
                style={{ transform: "rotate(0deg)" }}
              />
              <div
                className="fan-blade"
                style={{ transform: "rotate(120deg)" }}
              />
              <div
                className="fan-blade"
                style={{ transform: "rotate(240deg)" }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.4)",
              borderRadius: 8,
              padding: 4,
            }}
          >
            <button
              style={{
                padding: "4px 8px",
                fontSize: 9,
                fontWeight: 700,
                color: "#065f46",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              LOW
            </button>
            <button
              style={{
                padding: "4px 8px",
                fontSize: 9,
                fontWeight: 700,
                color: "#059669",
                background: "white",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              HI
            </button>
          </div>
          <Toggle
            checked={device.is_on}
            onChange={() => onToggle(device.id)}
            color="#10b981"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#1e293b",
            margin: "0 0 4px",
          }}
        >
          {device.name}
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            {device.room || "Master Suite"}
          </p>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              background: "#d1fae5",
              color: "#065f46",
              padding: "2px 8px",
              borderRadius: 9999,
            }}
          >
            1240 RPM
          </span>
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
  const [liveEnergy, setLiveEnergy] = useState(
    Number(device.total_energy || 0),
  );

  useEffect(() => {
    let interval;

    if (device.is_on && device.start_time) {
      interval = setInterval(() => {
        const seconds =
          (Date.now() - new Date(device.start_time).getTime()) / 1000;

        const hours = seconds / 3600;

        const energy =
          Number(device.total_energy || 0) +
          (device.power_rating * hours) / 1000;

        setLiveEnergy(energy);
      }, 1000);
    } else {
      setLiveEnergy(Number(device.total_energy || 0));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    device.is_on,
    device.start_time,
    device.total_energy,
    device.power_rating,
  ]);

  const watts = device.is_on
    ? `${device.power_rating} W`
    : `${liveEnergy.toFixed(3)} kWh`;
  return (
    <div
      className="device-card"
      style={{
        background: "#fef9c3",
        borderRadius: "2.5rem",
        padding: 32,
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0) 70%)",
          opacity: device.is_on ? 0.5 : 0.15,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 8,
                background: "#94a3b8",
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <div style={{ width: 4, height: 40, background: "#cbd5e1" }} />
            <div
              className="lamp-head"
              style={{
                width: 56,
                height: 30,
                background: "#e2e8f0",
                borderRadius: "50% 50% 0 0",
                marginTop: -4,
                border: "1px solid #cbd5e1",
                position: "relative",
              }}
            >
              {device.is_on && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    background: "rgba(251,191,36,0.5)",
                    filter: "blur(4px)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.4)",
              borderRadius: 8,
              padding: 4,
              gap: 4,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: "#d97706" }}
            >
              light_mode
            </span>
            <input
              type="range"
              style={{ width: 48, accentColor: "#f59e0b", opacity: 0.7 }}
            />
          </div>
          <Toggle
            checked={device.is_on}
            onChange={() => onToggle(device.id)}
            color="#f59e0b"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
        <h4
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#1e293b",
            margin: "0 0 4px",
          }}
        >
          {device.name}
        </h4>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          {device.room || "Workspace"}
        </p>
      </div>
      <div style={{ marginTop: "auto", position: "relative", zIndex: 1 }}>
        <Sparkline stroke="#d97706" />
        <LiveWatts value={watts} color="#d97706" dotColor="#f59e0b" />
      </div>
    </div>
  );
}

function GenericCard({ device, onToggle }) {
  const [liveEnergy, setLiveEnergy] = useState(
    Number(device.total_energy || 0),
  );
  useEffect(() => {
    let interval;

    if (device.is_on && device.start_time) {
      interval = setInterval(() => {
        const seconds =
          (Date.now() - new Date(device.start_time).getTime()) / 1000;

        const hours = seconds / 3600;

        const energy =
          Number(device.total_energy || 0) +
          (device.power_rating * hours) / 1000;

        setLiveEnergy(energy);
      }, 1000);
    } else {
      setLiveEnergy(Number(device.total_energy || 0));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    device.is_on,
    device.start_time,
    device.total_energy,
    device.power_rating,
  ]);

  const watts = device.is_on
    ? `${device.power_rating} W`
    : `${liveEnergy.toFixed(3)} kWh`;
  const type = detectType(device.name);
  const icon = type === "fridge" ? "kitchen" : "electrical_services";
  return (
    <div
      className="device-card"
      style={{
        background: "#e0f2fe",
        borderRadius: "2.5rem",
        padding: 32,
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: "rgba(255,255,255,0.6)",
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0284c7",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
            {icon}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{
              background: "rgba(255,255,255,0.4)",
              border: "none",
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Normal
          </button>
          <Toggle
            checked={device.is_on}
            onChange={() => onToggle(device.id)}
            color="#0ea5e9"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h4
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#1e293b",
            margin: "0 0 4px",
          }}
        >
          {device.name}
        </h4>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          {device.room || "Kitchen"}
        </p>
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
  if (type === "ac") return <ACCard device={device} onToggle={onToggle} />;
  if (type === "fan") return <FanCard device={device} onToggle={onToggle} />;
  if (type === "lamp") return <LampCard device={device} onToggle={onToggle} />;
  return <GenericCard device={device} onToggle={onToggle} />;
}

function AddDeviceModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const deviceTypes = [
    {
      key: "fan",
      icon: "mode_fan",
      label: "Fan",
      bg: "#dcfce7",
      color: "#059669",
    },
    {
      key: "lamp",
      icon: "table_lamp",
      label: "Lamp",
      bg: "#fef9c3",
      color: "#d97706",
    },
    {
      key: "ac",
      icon: "ac_unit",
      label: "AC",
      bg: "#e0f2fe",
      color: "#0284c7",
    },
    {
      key: "other",
      icon: "more_horiz",
      label: "Other",
      bg: "#f8fafc",
      color: "#64748b",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.4)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: 480,
          borderRadius: "3rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <h3
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Add New Device
            </h3>
            <button
              onClick={onClose}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              Device Name
            </label>
            <input
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "2px solid transparent",
                borderRadius: "1.5rem",
                padding: "16px 24px",
                fontSize: 15,
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="e.g. Master Bedroom Fan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              Watt Rating
            </label>
            <input
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "2px solid transparent",
                borderRadius: "1.5rem",
                padding: "16px 24px",
                fontSize: 15,
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="e.g. 45"
              value={watt}
              onChange={(e) => setWatt(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: 16,
              }}
            >
              Device Type
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
              }}
            >
              {deviceTypes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "1.5rem",
                    background: selectedType === t.key ? t.bg : t.bg + "80",
                    border:
                      selectedType === t.key
                        ? `2px solid ${t.color}`
                        : "2px solid transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    color: t.color,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 28 }}
                  >
                    {t.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onAdd(name, watt)}
            style={{
              width: "100%",
              background: "#ee5b2b",
              color: "white",
              border: "none",
              borderRadius: "1.5rem",
              padding: "20px 0",
              fontSize: 17,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(238,91,43,0.25)",
            }}
          >
            Register Device
          </button>
        </div>
        <div
          style={{
            background: "#f8fafc",
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#38bdf8", fontSize: 20 }}
            >
              wifi
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Ensure your device is in pairing mode. WattWise will scan for
            signals automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const load = async () => {
      if (!isLoaded || !user) return;
      const token = await getToken();
      if (!token) {
        console.error("No auth token");
        return;
      }
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
    socket.on("energy-update", (updatedDevice) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)),
      );
    });
    return () => socket.disconnect();
  }, [isLoaded, user]);
  const handleAdd = async (name, watt) => {
    const token = await getToken();
    await addDevice(name, Number(watt), token);
    setShowModal(false);
  };

  const handleToggle = async (id) => {
    const token = await getToken();
    await toggleDevice(id, token);
  };
  return (
    <div
      className="ww-bg"
      style={{ display: "flex", height: "100dvh", overflow: "hidden" }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        <main style={{ flex: 1, overflowY: "auto", padding: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#0f172a",
                  margin: "0 0 8px",
                  letterSpacing: "-0.03em",
                }}
              >
                My Smart Home
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: 0,
                  fontSize: 14,
                }}
              >
                <span
                  className="pulse-dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                Real-time telemetry active for {devices.length} devices
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#ee5b2b",
                color: "white",
                border: "none",
                borderRadius: "1rem",
                padding: "16px 32px",
                fontSize: 15,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(238,91,43,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <span className="material-symbols-outlined">add</span>
              Add New Device
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 32,
              marginBottom: 48,
            }}
          >
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleToggle}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <div
              style={{
                flex: 1,
                minWidth: 300,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "1.5rem",
                padding: 32,
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <h5
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Aggregate Energy Trend
                </h5>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#ee5b2b",
                    background: "rgba(238,91,43,0.1)",
                    padding: "4px 10px",
                    borderRadius: 9999,
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 12 }}
                  >
                    trending_up
                  </span>
                  Live Now
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  height: 120,
                }}
              >
                {[40, 65, 45, 85, 30, 55, 70].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      background: i === 3 ? "#ee5b2b" : "rgba(14,165,233,0.35)",
                      borderRadius: "4px 4px 0 0",
                      position: "relative",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (i !== 3)
                        e.currentTarget.style.background =
                          "rgba(14,165,233,0.55)";
                    }}
                    onMouseLeave={(e) => {
                      if (i !== 3)
                        e.currentTarget.style.background =
                          "rgba(14,165,233,0.35)";
                    }}
                  >
                    {i === 3 && (
                      <div
                        style={{
                          position: "absolute",
                          top: -22,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: 10,
                          fontWeight: 900,
                          color: "#ee5b2b",
                        }}
                      >
                        Peak
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                width: 340,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "1.5rem",
                padding: 32,
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <h5
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: "0 0 24px",
                }}
              >
                Device Clusters
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  { icon: "bedtime", label: "Sleep Mode", color: "#0ea5e9" },
                  { icon: "home", label: "Away Mode", color: "#f97316" },
                ].map((c) => (
                  <button
                    key={c.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      gap: 8,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.6)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: c.color, fontSize: 24 }}
                    >
                      {c.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <AddDeviceModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
