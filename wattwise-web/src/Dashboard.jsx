import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { fetchDevices, addDevice, toggleDevice } from "./services/deviceApi";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { getToken } = useAuth();

  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🔹 Load Devices
  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const data = await fetchDevices(token);
      setDevices(data);
    };
    load();
  }, []);

  // 🔹 Socket Connection
  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;

      const socket = io(BASE_URL, {
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
    setShowModal(false);
  };

  // 🔹 Toggle
  const handleToggle = async (id) => {
    const token = await getToken();
    await toggleDevice(id, token);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-100 to-purple-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 backdrop-blur-xl bg-white/60 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            ⚡
          </div>
          <h1 className="text-2xl font-black">WattWise</h1>
        </div>

        <nav className="space-y-3 text-slate-600 font-semibold">
          <div className="bg-white rounded-xl px-5 py-3 shadow">
            Dashboard
          </div>
          <div className="px-5 py-3 hover:bg-white rounded-xl cursor-pointer">
            Devices
          </div>
        </nav>

        <div className="mt-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto p-10">

        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black mb-2">
              My Smart Home
            </h2>
            <p className="text-slate-500">
              Control and monitor your devices
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition active:scale-95"
          >
            + Add Device
          </button>
        </div>

        {/* DEVICE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-lg border border-white/40"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-3xl">
                  {device.name.toLowerCase().includes("fan") && "🌀"}
                  {device.name.toLowerCase().includes("ac") && "❄️"}
                  {device.name.toLowerCase().includes("lamp") && "💡"}
                  {!device.name.match(/fan|ac|lamp/i) && "🔌"}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={device.isOn}
                    onChange={() => handleToggle(device.id)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <h4 className="text-2xl font-black mb-2">
                {device.name}
              </h4>

              <div className="bg-white rounded-2xl p-4 flex justify-between">
                <span className="text-sm font-bold text-slate-500">
                  Live Watts
                </span>

                <span className="font-black text-lg text-orange-500">
                  {device.isOn
                    ? `${(device.liveUnits * 1000).toFixed(1)} W`
                    : `${device.watt} W`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD DEVICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-8">
              <h3 className="text-3xl font-black">Add New Device</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="space-y-6">
              <input
                className="w-full bg-slate-100 rounded-2xl px-6 py-4"
                placeholder="Device Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full bg-slate-100 rounded-2xl px-6 py-4"
                placeholder="Watt"
                value={watt}
                onChange={(e) => setWatt(e.target.value)}
              />

              <button
                onClick={handleAdd}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold"
              >
                Register Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}