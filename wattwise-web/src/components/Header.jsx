"use client";

export default function Header({ goLogin }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#221A10] border-b border-[#EE9D2B]/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#EE9D2B] rounded-lg flex items-center justify-center text-[#221A10] font-bold">
            ⚡
          </div>
          <span className="text-white text-[1rem] font-medium">
            WattWise
          </span>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-10 text-white text-sm">
          <a href="#" className="hover:text-[#EE9D2B] transition">Features</a>
          <a href="#" className="hover:text-[#EE9D2B] transition">Dashboard</a>
          <a href="#" className="hover:text-[#EE9D2B] transition">Pricing</a>
          <a href="#" className="hover:text-[#EE9D2B] transition">About</a>
        </div>

        {/* Right Button */}
        <button
          onClick={goLogin}
          className="bg-[#EE9D2B] hover:opacity-90 text-[#221A10] px-6 py-2 rounded-lg font-semibold text-sm transition"
        >
          Get Started
        </button>

      </div>
    </header>
  );
}
