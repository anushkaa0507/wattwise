import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
export default function Sidebar({ user }: { user: any }) {
  return (
    <aside
      className="ww-frosted"
      style={{
        width: 272,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "32px 32px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#ee5b2b",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 8px 20px rgba(238,91,43,0.25)",
            }}
          >
            <span className="material-symbols-outlined">bolt</span>
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#1e293b",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            WattWise
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {[
          { icon: "dashboard", label: "Dashboard", active: true },
          { icon: "devices", label: "Device Analytics" },
          { icon: "history", label: "Energy Usage" },
         
          { icon: "settings", label: "Settings" },
        ].map((item) => (
          <a
            key={item.label}
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 24px",
              borderRadius: "1rem",
              background: item.active
                ? "rgba(255,255,255,0.6)"
                : "transparent",
              color: item.active ? "#1e293b" : "#64748b",
              fontWeight: item.active ? 700 : 500,
              textDecoration: "none",
            }}
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer User */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.4)",
            borderRadius: "1.5rem",
            padding: 16,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
           
          
          </div>
        </div>
      </div>
    </aside>
  );
}