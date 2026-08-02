import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-5">

      <h1 className="mb-10 text-3xl font-bold text-white">
        DSA Learning
      </h1>

      <nav className="flex flex-1 flex-col gap-2">

        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/problems"
          className={linkClass}
        >
          <BookOpen size={20} />
          Problems
        </NavLink>

        <NavLink
          to="/recommendations"
          className={linkClass}
        >
          <Sparkles size={20} />
          Recommendations
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClass}
        >
          <User size={20} />
          Profile
        </NavLink>

      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}