"use client";
import { motion } from "framer-motion";
import AuthModal from "../UI/AuthModal";
import { useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export function Header({ openAuth }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-icons text-pink-400">bolt</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--color-navy)]">
            WattWise
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a className=" text-[1rem] hover:bg-[var(--color-mint)] transition-colors" href="#">Features</a>
          <a className=" text-[1rem] hover:bg-[var(--color-mint)] transition-colors" href="#">Dashboard</a>
          <a className=" text-[1rem] hover:bg-[var(--color-mint)] transition-colors" href="#">Pricing</a>
          <a className=" text-[1rem] hover:bg-[var(--color-mint)] transition-colors" href="#">About</a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openAuth}
            className="bg-pink-400 hover:bg-pink-500 text-white shadow-xl shadow-pink-200/50 px-6 py-2 rounded-lg font-bold text-sm transition-all"
          >
            Get Started
          </button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default function Hero() {
  const galleryRow1 = [
    {
      title: "Solar Integration",
      description: "Harvest and monitor every watt.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGAtEPXBP2ieEQ5L-WJ1KpV-LPHiiZzmsOT7O1FQcwdYeiLl1J4-m9e8YGr43Us7dEqrZ2_uIWjkurGcUbXdKERb23djK7fyaEABIXUjq9xAf8vZyEhvvLZH3fAlsxvmJDSrY_TJQKtFBx0J6XGdnhZxkVjNHRP8wMMFaWUJZoHWgmO6-85AWGMCb6HsNOjRw3gSScnuES-eab5OrEhZcSH-asZqH96K-oexIBGNZjV9MOYb_sTajOXOVUo3sdGpLl7fFhl4jF1A",
      accent: "from-amber-400/80 to-orange-500/60",
      tag: "🌞 Solar",
    },
    {
      title: "Smart Lighting",
      description: "Ambience meets peak efficiency.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACcL2VIEd6F0Ipj8hba3jfZQ4A8lsfPwjiUkDvCvJLZd5Xhx538b6Oy_7GrPCLSN-JjawNkbch9WcB92Y20kSzsNumyohXp87pO6CBRcjMXqS7QYA7PzZInjGswVkHMYKuk-5h2GSQYV4Svw2Tw-muOUxzn66rN6n6obRkDSiKUOrLVUDdYTaCA3klcoysCYHt0q4vzC2jnZvHHlBoB7Bt5G5ujhobNcEmVZG5R4kV8EhqemyyjcowWXvyb05-PpozYtGbnINLkw",
      accent: "from-yellow-300/80 to-pink-400/60",
      tag: "💡 Lighting",
    },
    {
      title: "EV Management",
      description: "Smart charging during off-peak hours.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLO2n6pRYgeIe1q2wF2qY5azBO-4BO6tY5psZ2hXNVafmX8ZH55DpJfjatYFyIng4LXAIVGgXr8Ym7i7K2aoHcKt5O8NpiAquOQv6MWarrehC4P5NqktPcUd06awjYP5Z857xg6ItMD-SMprMRQUpMK1rbcMgVnX19uWWTTDhNvvCspuclYAqA8PN0iStTH0gTDLlsVJh7ohfJxaDJsSmvCxS0xmf5eJ6u-c4gQEs14qCnSg-tm-HdS50GvPYOFD0tXQjnpUXM2A",
      accent: "from-emerald-400/80 to-teal-500/60",
      tag: "⚡ EV",
    },
    {
      title: "Wind Energy",
      description: "Tap into renewable grid power.",
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=640&q=80&auto=format&fit=crop",
      accent: "from-sky-400/80 to-blue-500/60",
      tag: "🌬️ Wind",
    },
    {
      title: "Battery Storage",
      description: "Store surplus, spend smarter.",
      img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=640&q=80&auto=format&fit=crop",
      accent: "from-violet-400/80 to-purple-500/60",
      tag: "🔋 Storage",
    },
    {
      title: "Smart Thermostat",
      description: "Comfort without the energy waste.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80&auto=format&fit=crop",
      accent: "from-rose-400/80 to-pink-500/60",
      tag: "🌡️ Climate",
    },
  ];
  const galleryRow2 = [
    {
      title: "Energy Analytics",
      description: "Deep insights at a glance.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80&auto=format&fit=crop",
      accent: "from-blue-400/80 to-indigo-500/60",
      tag: "📊 Analytics",
    },
    {
      title: "Smart Home Hub",
      description: "All devices, one dashboard.",
      img: "https://images.unsplash.com/photo-1558002038-1055e2dae1d7?w=640&q=80&auto=format&fit=crop",
      accent: "from-teal-400/80 to-emerald-500/60",
      tag: "🏠 Hub",
    },
    {
      title: "Grid Management",
      description: "Peak load balancing, automated.",
      img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=640&q=80&auto=format&fit=crop",
      accent: "from-orange-400/80 to-red-500/60",
      tag: "🔌 Grid",
    },
    {
      title: "Solar Rooftop",
      description: "Turn every roof into a power plant.",
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=640&q=80&auto=format&fit=crop",
      accent: "from-amber-300/80 to-yellow-500/60",
      tag: "☀️ Rooftop",
    },
    {
      title: "Real-time Monitoring",
      description: "Live data. Zero blind spots.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop",
      accent: "from-cyan-400/80 to-blue-500/60",
      tag: "📡 Live",
    },
    {
      title: "Green Certification",
      description: "Track your carbon footprint live.",
      img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=640&q=80&auto=format&fit=crop",
      accent: "from-green-400/80 to-emerald-500/60",
      tag: "🌿 Green",
    },
  ];
  const extendedRow1 = [...galleryRow1, ...galleryRow1];
  const extendedRow2 = [...galleryRow2, ...galleryRow2];
  const [authOpen, setAuthOpen] = useState(false);
  const [devices, setDevices] = useState([
    { name: "Living Room AC", color: "bg-[var(--baby-blue)]", icon: "ac_unit", on: true },
    { name: "Kitchen Hub", color: "bg-[var(--mint-green)]", icon: "lightbulb", on: true },
    { name: "Smart Oven", color: "bg-[var(--pale-yellow)]", icon: "oven", on: true },
  ]);
  const toggleDevice = (index) => {
    setDevices((prev) =>
      prev.map((device, i) => (i === index ? { ...device, on: !device.on } : device))
    );
  };
  return (
    <div className="font-display bg-pastel-gradient text-slate-800 min-h-screen">
      <Header openAuth={() => setAuthOpen(true)} />

      <main className="relative pt-20">
        <SignedIn>
          <div className="fixed top-24 right-6 z-50">
            <a
              href="/"
              className="bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
              onClick={() => window.location.reload()}
            >
              Enter Dashboard →
            </a>
          </div>
        </SignedIn>

        <div className="absolute top-0 right-0 w-[500px] h-125 bg-pink-200/40 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-100 bg-blue-200/40 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] -z-10"></div>

        <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            NEW: SMART HUB INTEGRATION 2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--color-navy)] leading-[1.1]">
            {" "}Master Your <span className="text-primary">Energy</span> Consumption
          </h1>

          <p className="text-lg md:text-xl text-slate-500 text-slate-400 max-w-2xl p-6">
            Take control of your home's efficiency with real-time monitoring,
            AI-driven insights, and seamless smart device automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-[var(--pastel-coral)] hover:bg-pink-400 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-pink-200/50"
            >
              Start Saving Now
            </button>
            <button className="bg-white/80 border border-white/60 hover:border-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-[#1e293b] shadow-sm backdrop-blur-sm">
              <span className="material-icons text-sm">play_circle</span>
              Watch Demo
            </button>
          </div>

          {/* ── Dashboard Preview ─────────────────────────────────────────── */}
          <div className="relative w-full max-w-6xl mx-auto mb-16">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[3rem] p-6 md:p-10 dashboard-glow">
              <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-[#1e293b]">Energy Overview</h3>
                  <p className="text-sm text-slate-500">All systems operational • Live Update</p>
                </div>
                <div className="bg-blue-50 text-blue-500 border border-blue-100 px-5 py-2 rounded-xl text-sm font-bold">
                  ⚡ 1.28 kW
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {devices.map((item, i) => (
                    <div
                      key={i}
                      className={`
                        ${item.color}
                        relative overflow-hidden p-5 rounded-2xl flex items-center justify-between transition-all duration-500 ease-out
                        ${item.on
                          ? "shadow-[0_10px_30px_rgba(59,130,246,0.35)] scale-[1.02] brightness-100 border-white/60"
                          : "opacity-50 grayscale scale-[0.98] shadow-none border-white/20"
                        }
                      `}
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${item.on ? "opacity-100" : "opacity-0"}`}
                        style={{ background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 60%)" }}
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
                          <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                          <div className={`text-sm font-bold transition-colors duration-500 ${item.on ? "text-[#1e293b]" : "text-slate-400"}`}>
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500">{item.on ? "Active" : "Off"}</div>
                        </div>
                      </div>
                      <div
                        onClick={() => toggleDevice(i)}
                        className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all duration-300 ${item.on ? "bg-gradient-to-r from-blue-400 to-emerald-400" : "bg-gray-300"}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${item.on ? "translate-x-6" : "translate-x-0"}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-8 bg-white/40 border border-white/60 p-8 rounded-[2.5rem] flex flex-col">
                  <div className="h-60 flex items-end gap-3">
                    <div className="flex-1 bg-blue-100/50 h-[30%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-100/50 h-[45%] rounded-t-xl"></div>
                    <div className="flex-1 bg-emerald-200/40 h-[65%] rounded-t-xl"></div>
                    <div className="flex-1 bg-emerald-200/60 h-[80%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-200 h-[95%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-200/80 h-[75%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-200/60 h-[60%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-100/50 h-[40%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-100/50 h-[25%] rounded-t-xl"></div>
                    <div className="flex-1 bg-blue-100/50 h-[15%] rounded-t-xl"></div>
                  </div>
                  <div className="mt-8">
                    <div className="pastel-line-gradient w-full opacity-60"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="pastel-line-gradient w-full opacity-60"></div>
              </div>
            </div>
          </div>

     {/* ── Enhanced Dual-Row Sliding Gallery ─────────────────────────── */}
<div className="w-screen overflow-hidden py-16 relative [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]">
            {/* Section label */}
            <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 whitespace-nowrap">
                Powering Every Corner of Your Home
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />

            {/* Row 1 — scrolls LEFT */}
            <div className="overflow-hidden mb-4">
              <motion.div
                className="flex w-max gap-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 28, repeat: Infinity }}
                style={{ willChange: "transform" }}
              >
                {extendedRow1.map((item, index) => (
                  <GalleryCard key={`r1-${index}`} item={item} />
                ))}
              </motion.div>
            </div>

            {/* Row 2 — scrolls RIGHT (opposite direction) */}
            <div className="overflow-hidden">
              <motion.div
                className="flex w-max gap-4"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ ease: "linear", duration: 32, repeat: Infinity }}
                style={{ willChange: "transform" }}
              >
                {extendedRow2.map((item, index) => (
                  <GalleryCard key={`r2-${index}`} item={item} tall />
                ))}
              </motion.div>
            </div>
          </div>
          {/* ── End Gallery ───────────────────────────────────────────────── */}
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">solar_power</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Solar Grid</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">outlet</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Smart Plug</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">home_max</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Automation</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">battery_charging_full</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Storage</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">settings_input_component</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Connectors</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons text-3xl">analytics</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Big Data</span>
            </div>
          </div>
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </section>
      </main>
    </div>
  );
}

function GalleryCard({ item, tall = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl flex-shrink-0 bg-slate-900
        ${tall ? "h-52 w-[280px]" : "h-56 w-[300px]"}
      `}
    >
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out"
        loading="lazy"
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
          {item.tag}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <h4 className="font-bold text-base text-white leading-tight">{item.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {item.description}
        </p>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)" }}
      />
    </div>
  );
}