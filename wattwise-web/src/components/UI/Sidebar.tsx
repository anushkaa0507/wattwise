// src/components/UI/Sidebar.tsx
import { NavLink } from "react-router-dom";

interface SidebarProps {
  user: any;
  open: boolean;       // mobile drawer open state
  onClose: () => void; // close drawer
}

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard",        path: "/"            },
  { icon: "devices",   label: "Device Analytics", path: "/analytics"   },
  { icon: "history",   label: "Energy Usage",     path: "/energy-usage"},
  { icon: "settings",  label: "Settings",         path: "/settings"    },
];

/* ── Shared sidebar body (used by both desktop & mobile) ── */
function SidebarBody({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {/* Logo row */}
      <div style={{ padding: "32px 32px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: "#ee5b2b", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", boxShadow: "0 8px 20px rgba(238,91,43,0.25)", flexShrink: 0,
          }}>
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            WattWise
          </h1>
        </div>

        {/* Close button — only shown in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer",
              borderRadius: 10, padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748b",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}   // close drawer on mobile when navigating
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 24px",
              borderRadius: "1rem",
              background: isActive ? "rgba(255,255,255,0.6)" : "transparent",
              color: isActive ? "#1e293b" : "#64748b",
              fontWeight: isActive ? 700 : 500,
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            })}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer spacer */}
      <div style={{ padding: 24 }}>
        <div style={{
          background: "rgba(255,255,255,0.4)", borderRadius: "1.5rem",
          padding: 16, border: "1px solid rgba(255,255,255,0.2)",
        }} />
      </div>
    </>
  );
}

export default function Sidebar({ user, open, onClose }: SidebarProps) {
  return (
    <>
      {/* ─────────────────────────────────────────
          DESKTOP sidebar — always visible ≥ 1024px
      ───────────────────────────────────────── */}
      <aside
        className="ww-frosted ww-sidebar-desktop"
        style={{
          width: 272,
          flexShrink: 0,
          display: "flex",       // toggled to "none" on mobile via CSS below
          flexDirection: "column",
          zIndex: 20,
        }}
      >
        <SidebarBody />
      </aside>

      {/* ─────────────────────────────────────────
          MOBILE drawer — slide in from left < 1024px
      ───────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        className="ww-drawer-backdrop"   // hidden on desktop via CSS
      />

      {/* Drawer panel */}
      <aside
        className="ww-frosted ww-drawer-panel"
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: 280,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <SidebarBody onClose={onClose} />
      </aside>

      {/* ── Scoped responsive CSS ── */}
      <style>{`
        /* Desktop: show static sidebar, hide mobile drawer elements */
        @media (min-width: 1024px) {
          .ww-sidebar-desktop  { display: flex !important; }
          .ww-drawer-backdrop  { display: none !important; }
          .ww-drawer-panel     { display: none !important; }
        }

        /* Mobile: hide static sidebar, drawer is position:fixed so always rendered */
        @media (max-width: 1023px) {
          .ww-sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}