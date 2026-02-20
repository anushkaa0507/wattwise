// Hero.jsx or Hero.tsx
"use client";
import { motion } from "framer-motion";

// Reusable Header Component
export function Header({ goLogin }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-icons text-background-dark">bolt</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">WattWise</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a className="hover:text-primary transition-colors" href="#">Features</a>
          <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
          <a className="hover:text-primary transition-colors" href="#">Pricing</a>
          <a className="hover:text-primary transition-colors" href="#">About</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={goLogin}
            className="px-5 py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={goLogin}
            className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2 rounded-lg font-bold text-sm transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}

export default function Hero({ goLogin }) {
  // For sliding animation in the gallery, we'll use Framer Motion to create an infinite slider
  const galleryItems = [
    {
      title: "Solar Integration",
      description: "Harvest and monitor every watt.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGAtEPXBP2ieEQ5L-WJ1KpV-LPHiiZzmsOT7O1FQcwdYeiLl1J4-m9e8YGr43Us7dEqrZ2_uIWjkurGcUbXdKERb23djK7fyaEABIXUjq9xAf8vZyEhvvLZH3fAlsxvmJDSrY_TJQKtFBx0J6XGdnhZxkVjNHRP8wMMFaWUJZoHWgmO6-85AWGMCb6HsNOjRw3gSScnuES-eab5OrEhZcSH-asZqH96K-oexIBGNZjV9MOYb_sTajOXOVUo3sdGpLl7fFhl4jF1A",
    },
    {
      title: "Smart Lighting",
      description: "Ambience meets peak efficiency.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACcL2VIEd6F0Ipj8hba3jfZQ4A8lsfPwjiUkDvCvJLZd5Xhx538b6Oy_7GrPCLSN-JjawNkbch9WcB92Y20kSzsNumyohXp87pO6CBRcjMXqS7QYA7PzZInjGswVkHMYKuk-5h2GSQYV4Svw2Tw-muOUxzn66rN6n6obRkDSiKUOrLVUDdYTaCA3klcoysCYHt0q4vzC2jnZvHHlBoB7Bt5G5ujhobNcEmVZG5R4kV8EhqemyyjcowWXvyb05-PpozYtGbnINLkw",
    },
    {
      title: "EV Management",
      description: "Smart charging during off-peak hours.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLO2n6pRYgeIe1q2wF2qY5azBO-4BO6tY5psZ2hXNVafmX8ZH55DpJfjatYFyIng4LXAIVGgXr8Ym7i7K2aoHcKt5O8NpiAquOQv6MWarrehC4P5NqktPcUd06awjYP5Z857xg6ItMD-SMprMRQUpMK1rbcMgVnX19uWWTTDhNvvCspuclYAqA8PN0iStTH0gTDLlsVJh7ohfJxaDJsSmvCxS0xmf5eJ6u-c4gQEs14qCnSg-tm-HdS50GvPYOFD0tXQjnpUXM2A",
    },
  ];

  // Duplicate items for infinite loop effect
  const extendedGallery = [...galleryItems, ...galleryItems, ...galleryItems];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      <Header goLogin={goLogin} />
      <main className="relative pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-dots -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            NEW: SMART HUB INTEGRATION 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
            Master Your <span className="text-primary">Energy</span> Consumption
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10">
            Take control of your home’s efficiency with real-time monitoring, AI-driven insights, and seamless smart device automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button 
              onClick={goLogin}
              className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
            >
              Start Saving Now
            </button>
            <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
              <span className="material-icons text-sm">play_circle</span>
              Watch Demo
            </button>
          </div>

          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-5xl mx-auto mb-24"
          >
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-8 dashboard-glow overflow-hidden">
              {/* Top Bar of Dashboard */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="text-left">
                  <h3 className="text-xl font-bold">Live Dashboard</h3>
                  <p className="text-sm text-slate-500">System status: Optimizing</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="material-icons text-sm">bolt</span>
                    Current: 1.2 kW
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium">
                    March 24, 2024
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Device Controls */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-icons">ac_unit</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Living Room AC</div>
                        <div className="text-xs text-slate-500">22°C • Auto Mode</div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <span className="material-icons">lightbulb</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Kitchen Hub</div>
                        <div className="text-xs text-slate-500">Status: Off</div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-icons">router</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Main Router</div>
                        <div className="text-xs text-slate-500">Online • 45W</div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>
                {/* Right Panel: Graph */}
                <div className="lg:col-span-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Consumption History (kWh)</span>
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium">Daily Usage</span>
                    </div>
                  </div>
                  <div className="h-48 relative flex items-end justify-between px-2">
                    {/* Mock Graph Bars */}
                    <div className="w-[8%] bg-primary/20 h-[40%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/40 h-[60%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/20 h-[35%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/60 h-[80%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary h-[95%] rounded-t-sm shadow-[0_-4px_10px_rgba(238,157,43,0.5)]"></div>
                    <div className="w-[8%] bg-primary/40 h-[50%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/30 h-[45%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/50 h-[70%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/20 h-[30%] rounded-t-sm"></div>
                    <div className="w-[8%] bg-primary/10 h-[20%] rounded-t-sm"></div>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-medium text-slate-500">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                    <span>18:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Brand Strip / Gallery */}
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
        </section>

        {/* Image Gallery Feature Section with Sliding Animation */}
        <section className="max-w-7xl mx-auto px-6 py-24 overflow-hidden">
          <motion.div 
            className="flex"
            animate={{ x: [0, -100 * galleryItems.length + "%"] }} // Slide to left infinitely
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20, // Adjust speed
                ease: "linear",
              },
            }}
            style={{ width: `${extendedGallery.length * (100 / galleryItems.length)}%` }}
          >
            {extendedGallery.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl h-64 bg-slate-900" style={{ width: `${100 / galleryItems.length}%` }}>
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent flex items-end p-6">
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}