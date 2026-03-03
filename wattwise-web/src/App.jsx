import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Hero from "./components/Hero/Hero";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <>
      <SignedOut>
        <Hero />
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}