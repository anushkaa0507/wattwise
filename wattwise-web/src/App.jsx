import { useEffect, useState, useRef } from "react";
import { fetchDevices, addDevice, toggleDevice } from "./services/deviceApi";
import DeviceCard from "./components/DeviceCard";
// import "./App.css";
import Hero from "./Hero";
import Login from "./Login";

function App() {
  const [page, setPage] = useState("hero");
const token = localStorage.getItem("token");
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");
  const intervalRef = useRef(null);
  const loadDevices = async () => {
    const data = await fetchDevices();
    setDevices(data);
  };
useEffect(() => {
  loadDevices();
}, []);
// Start polling ONLY if any device is ON
useEffect(() => {
  const anyDeviceOn = devices.some((d) => d.isOn);

  // If device turned ON → start polling
  if (anyDeviceOn && !intervalRef.current) {
    intervalRef.current = setInterval(() => {
      loadDevices();
    }, 1000);
  }

  // If all devices OFF → stop polling
  if (!anyDeviceOn && intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Cleanup when component unmounts
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [devices]);

  const handleAdd = async () => {
    if (!name || !watt) return;
    await addDevice(name, Number(watt));
    setName("");
    setWatt("");
    loadDevices();
  };
  const handleToggle = async (id) => {
    await toggleDevice(id);
    loadDevices();
  };
  if (!token) {
  if (page === "hero") return <Hero goLogin={() => setPage("login")} />;
  if (page === "login") return <Login onSuccess={() => window.location.reload()} />;
}

  return (
    <div className="container">
      <h1> WattWise Energy Calculator</h1>

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

export default App;
