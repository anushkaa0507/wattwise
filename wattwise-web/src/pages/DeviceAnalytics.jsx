// src/pages/DeviceAnalytics.jsx
import React from "react";

const devices = [
  { name: "Smart Fan", icon: "cyclone", status: "Active Now", color: "green-500" },
  { name: "Desk Lamp", icon: "table_lamp", status: "Standby", color: "slate-400" },
  { name: "Living Room", icon: "lightbulb", status: "Offline", color: "slate-400" },
  { name: "Smart TV", icon: "tv", status: "Standby", color: "slate-400" },
  { name: "Fridge", icon: "kitchen", status: "Standby", color: "slate-400" },
];

const DeviceAnalytics = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background-light dark:bg-background-dark">
      {/* Device Selection */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Select Device to Track
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {devices.map((device, idx) => (
            <button
              key={idx}
              className={`flex-shrink-0 w-36 p-4 rounded-xl border ${
                device.status === "Active Now" ? "border-primary bg-white dark:bg-slate-900 shadow-md" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50"
              } transition-all`}
            >
              <div className={`size-16 mx-auto mb-3 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center relative`}>
                <span className={`material-symbols-outlined text-4xl ${device.status === "Active Now" ? "text-primary" : "text-slate-400"}`}>
                  {device.icon}
                </span>
                {device.status === "Active Now" && (
                  <div className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                )}
              </div>
              <p className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">{device.name}</p>
              <p className={`text-[10px] font-medium text-center ${device.status === "Active Now" ? "text-primary" : "text-slate-400"}`}>{device.status}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Live Performance Area */}
      <div className="grid grid-cols-12 gap-8">
        {/* Central Hub */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold">Live Performance: Smart Fan</h2>
                <p className="text-slate-500 dark:text-slate-400">Real-time telemetry and energy output</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full"></span> Operational
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* 3D Render Placeholder */}
              <div className="relative group">
                <div className="aspect-square bg-white/40 dark:bg-white/5 rounded-3xl flex items-center justify-center p-8 backdrop-blur-sm shadow-inner ring-1 ring-white/20">
                  <div className="text-primary opacity-20 absolute scale-[3] pointer-events-none">
                    <span className="material-symbols-outlined text-[100px]">cyclone</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl relative z-10 transition-transform hover:scale-105 duration-500">
                    <span className="material-symbols-outlined text-8xl text-primary">toys_fan</span>
                    <div className="mt-4 flex justify-center gap-2">
                      <div className="size-2 bg-primary rounded-full"></div>
                      <div className="size-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="size-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Current Power</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">42.8</span>
                    <span className="text-sm font-medium text-slate-500">Watts</span>
                  </div>
                  <div className="mt-3 h-8 flex items-end gap-1">
                    <div className="w-1 bg-primary/20 h-2 rounded-full"></div>
                    <div className="w-1 bg-primary/20 h-4 rounded-full"></div>
                    <div className="w-1 bg-primary/40 h-3 rounded-full"></div>
                    <div className="w-1 bg-primary/60 h-6 rounded-full"></div>
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <div className="w-1 bg-primary/80 h-5 rounded-full"></div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Energy Today</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">1.24</span>
                    <span className="text-sm font-medium text-slate-500">kWh</span>
                  </div>
                  <p className="text-[10px] text-green-600 font-bold mt-2">↑ 5% from yesterday</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Mode</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-primary">eco</span>
                    <span className="font-semibold">Eco Mode</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Health Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="font-semibold">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Chart Area */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold">Real-time Wattage</h4>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-slate-800 font-bold">1H</span>
                <span className="px-2 py-1 text-[10px] rounded bg-primary text-white font-bold">LIVE</span>
              </div>
            </div>
            <div className="h-48 w-full flex items-end justify-between gap-2">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div key={idx} className={`flex-1 bg-primary/20 rounded-t-lg h-[${Math.floor(Math.random() * 100)}%]`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Analytics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold mb-6">Energy Breakdown</h4>
            {/* Example energy bars */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Total Usage</span>
                  <span className="font-bold">245 kWh</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-400" style={{ width: "45%" }}></div>
                  <div className="h-full bg-indigo-400" style={{ width: "25%" }}></div>
                  <div className="h-full bg-cyan-400" style={{ width: "20%" }}></div>
                  <div className="h-full bg-slate-300 dark:bg-slate-700" style={{ width: "10%" }}></div>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Fan Usage</span>
                  </div>
                  <span className="text-sm font-bold">110 kWh</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-indigo-400"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lamp Usage</span>
                  </div>
                  <span className="text-sm font-bold">61 kWh</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-cyan-400"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Others</span>
                  </div>
                  <span className="text-sm font-bold">49 kWh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceAnalytics;