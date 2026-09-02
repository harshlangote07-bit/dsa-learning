import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
          Welcome, {user?.name ?? "there"}
        </h2>
        <p className="hidden text-sm text-slate-500 sm:block">
          Keep learning. Keep solving.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-sm font-medium text-slate-200">
            {user?.name ?? "User"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.role === "ADMIN" ? "Administrator" : "Learner"}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/15 text-sm font-bold text-blue-400 ring-1 ring-inset ring-blue-500/25">
          {firstLetter}
        </div>
      </div>
    </header>
  );
}
