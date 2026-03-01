import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { fetchDevices, addDevice, toggleDevice } from "./services/deviceApi";
import DeviceCard from "./components/DeviceCard";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { getToken } = useAuth();

  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");

  // 🔹 Initial Load
  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const data = await fetchDevices(token);
      setDevices(data);
    };
    load();
  }, []);

useEffect(() => {
  const connectSocket = async () => {
    const token = await getToken();
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.sub;

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    socket.emit("join", userId);

    socket.on("energy-update", (updatedDevices) => {
      setDevices(updatedDevices);
    });

    return () => socket.disconnect();
  };

  connectSocket();
}, []);

  // 🔹 Add Device
  const handleAdd = async () => {
    if (!name || !watt) return;

    const token = await getToken();
    await addDevice(name, Number(watt), token);

    setName("");
    setWatt("");
  };

  // 🔹 Toggle Device
  const handleToggle = async (id) => {
    const token = await getToken();
    await toggleDevice(id, token);
  };

  return (
    <div className="container">
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <UserButton afterSignOutUrl="/" />
      </div>

      <h1>⚡ WattWise Energy Calculator</h1>

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