import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Hero from "./Hero";
import Dashboard from "./Dashboard";

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