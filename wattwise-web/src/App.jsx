import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");

  const fetchDevices = async () => {
    const res = await axios.get("http://localhost:5000/devices");
    setDevices(res.data);
  };

  useEffect(() => {
    fetchDevices();

    socket.on("energy-update", (data) => {
      setDevices(data);
    });

    return () => socket.disconnect();
  }, []);

  const addDevice = async () => {
    await axios.post("http://localhost:5000/add-device", {
      name,
      watt: Number(watt)
    });

    setName("");
    setWatt("");
    fetchDevices();
  };

  const toggleDevice = async (id) => {
    await axios.post(`http://localhost:5000/toggle/${id}`);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>⚡ Wattwise Energy Calculator</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Device Name (Fan, TV...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Watt"
          value={watt}
          onChange={(e) => setWatt(e.target.value)}
        />

        <button onClick={addDevice}>Add Device</button>
      </div>

      {devices.map((d) => (
        <div key={d.id} style={{
          border: "1px solid #ccc",
          padding: 20,
          marginBottom: 10
        }}>
          <h3>{d.name}</h3>
          <p>{d.watt} W</p>
          <p>Units: {(d.units + (d.liveUnits || 0)).toFixed(4)} kWh</p>

          <button onClick={() => toggleDevice(d.id)}>
            {d.isOn ? "Turn OFF" : "Turn ON"}
          </button>
        </div>
      ))}
    </div>
  );
}
