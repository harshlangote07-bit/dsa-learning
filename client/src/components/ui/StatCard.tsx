import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-slate-800 p-4 text-blue-400 transition group-hover:bg-blue-500 group-hover:text-white">
          {icon}
        </div>

      </div>

    </div>
  );
}