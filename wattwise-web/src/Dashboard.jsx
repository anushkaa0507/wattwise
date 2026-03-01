import { useEffect, useState, useRef } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { fetchDevices, addDevice, toggleDevice } from "./services/deviceApi";
import DeviceCard from "./components/DeviceCard";

export default function Dashboard() {
  const { getToken } = useAuth();

  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");

  const intervalRef = useRef(null);

  // 🔹 Load Devices From Backend
  const loadDevices = async () => {
    try {
      const token = await getToken(); // Clerk session token
      const data = await fetchDevices(token);
      setDevices(data);
    } catch (err) {
      console.error("Failed to load devices", err);
    }
  };

  // Initial Load
  useEffect(() => {
    loadDevices();
  }, []);

  // 🔹 Smart Polling (only when a device is ON)
  useEffect(() => {
    const anyDeviceOn = devices.some((d) => d.isOn);

    if (anyDeviceOn && !intervalRef.current) {
      intervalRef.current = setInterval(loadDevices, 1000);
    }

    if (!anyDeviceOn && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [devices]);

  // 🔹 Add Device
  const handleAdd = async () => {
    if (!name || !watt) return;

    try {
      const token = await getToken();
      await addDevice(name, Number(watt), token);

      setName("");
      setWatt("");
      loadDevices();
    } catch (err) {
      console.error("Failed to add device", err);
    }
  };

  // 🔹 Toggle Device
  const handleToggle = async (id) => {
    try {
      const token = await getToken();
      await toggleDevice(id, token);
      loadDevices();
    } catch (err) {
      console.error("Failed to toggle device", err);
    }
  };

  return (
    <div className="container">
      {/* Top Right User Profile */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <UserButton afterSignOutUrl="/" />
      </div>

      <h1>⚡ WattWise Energy Calculator</h1>

      {/* Add Device Form */}
      <div className="add-form">
        <input
          placeholder="Device Name (Fan, TV, Light...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Watt"
          value={watt}
          onChange={(e) => setWatt(e.target.value)}
        />

        <button onClick={handleAdd}>Add Device</button>
      </div>

      {/* Devices Grid */}
      <div className="device-grid">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}