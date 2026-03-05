import { Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import Sidebar from "../components/UI/Sidebar";

export default function AppLayout() {
  const { user } = useUser();

  return (
    <div
      className="ww-bg"
      style={{ display: "flex", height: "100vh", overflow: "hidden" }}
    >
      <Sidebar user={user} open={false} onClose={function (): void {
              throw new Error("Function not implemented.");
          } } />

      {/* MAIN COLUMN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <header
          className="ww-header"
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            Welcome back 👋
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {user?.firstName} {user?.lastName}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Home Owner
              </p>
            </div>

            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: 40 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}