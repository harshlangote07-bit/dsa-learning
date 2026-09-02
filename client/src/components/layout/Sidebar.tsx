import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  User,
  LogOut,
  History,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600/15 text-blue-400 shadow-sm ring-1 ring-inset ring-blue-500/20"
        : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
    }`;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800/80 bg-slate-900/80 px-4 py-4 backdrop-blur lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
      <div className="mb-5 flex items-center justify-between lg:mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/40">
            D
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              DSA Learning
            </h1>
            <p className="text-xs text-slate-500">Practice. Improve. Master.</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-1.5 overflow-x-auto lg:flex-1 lg:flex-col lg:gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} className="shrink-0" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/problems" className={linkClass}>
          <BookOpen size={18} className="shrink-0" />
          <span>Problems</span>
        </NavLink>

        <NavLink to="/submissions" className={linkClass}>
          <History size={18} className="shrink-0" />
          <span>Submissions</span>
        </NavLink>

        <NavLink to="/recommendations" className={linkClass}>
          <Sparkles size={18} className="shrink-0" />
          <span>Recommendations</span>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={18} className="shrink-0" />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="mt-4 hidden border-t border-slate-800/80 pt-4 lg:block">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200 ring-1 ring-slate-700">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-slate-500">Account</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
