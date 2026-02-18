import React from "react";
import "../components/device.css";

export default function DeviceCard({ device, onToggle }) {
  return (
    <div className="card">
      <h3>{device.name}</h3>
      <p>{device.watt} W</p>
      <p>Units: {device.units.toFixed(4)} kWh</p>

      <button onClick={() => onToggle(device.id)}>
        {device.isOn ? "Turn OFF" : "Turn ON"}
      </button>

      {device.name.toLowerCase() === "fan" && (
        <div className={`fan ${device.isOn ? "spin" : ""}`} />
      )}

      {device.name.toLowerCase() === "lamp" && (
        <div className={`bulb ${device.isOn ? "glow" : ""}`} />
      )}
    </div>
  );
}
