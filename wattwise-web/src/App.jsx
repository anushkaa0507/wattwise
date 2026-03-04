import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import Dashboard from "./components/dashboard/Dashboard";
import DeviceAnalytics from "./pages/DeviceAnalytics";

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          <>
            <SignedOut>
              <Hero />
            </SignedOut>

            <SignedIn>
              <Dashboard />
            </SignedIn>
          </>
        }
      />

      {/* Protected Analytics Route */}
      <Route
        path="/analytics"
        element={
          <SignedIn>
            <DeviceAnalytics />
          </SignedIn>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}