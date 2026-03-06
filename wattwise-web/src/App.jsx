// import { SignedIn, SignedOut } from "@clerk/clerk-react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Hero from "./components/Hero/Hero";
// import Dashboard from "./components/dashboard/Dashboard";
// import DeviceAnalytics from "./pages/DeviceAnalytics";
// import AppLayout from "./layout/AppLayout";
// import EnergyUsage from "./pages/EnergyUsage";

// export default function App() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route
//         path="/"
//         element={
//           <>
//             <SignedOut>
//               <Hero />
//             </SignedOut>

//             <SignedIn>
//               <AppLayout />
//             </SignedIn>
//           </>
//         }
//       >
//         {/* Nested protected routes */}
//         <Route index element={<Dashboard />} />
//         <Route path="analytics" element={<DeviceAnalytics />} />
//         <Route path="energy-usage" element={<EnergyUsage />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";

import Hero from "./components/Hero/Hero";
import Dashboard from "./components/dashboard/Dashboard";
import DeviceAnalytics from "./pages/DeviceAnalytics";
import AppLayout from "./layout/AppLayout";
import EnergyUsage from "./pages/EnergyUsage";

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Hero />} />

      {/* App */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<DeviceAnalytics />} />
        <Route path="energy-usage" element={<EnergyUsage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}