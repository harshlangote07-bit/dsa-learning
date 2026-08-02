import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-8">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome, {user?.name}
        </h2>

        <p className="text-slate-400">
          Happy Coding 🚀
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {user?.name.charAt(0)}
        </div>

      </div>

    </header>
  );
}