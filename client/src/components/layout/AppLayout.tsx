import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}