import { useNavigate } from "react-router-dom";

import type { Problem } from "../../types/problem";

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({
  problem,
}: ProblemCardProps) {
  const navigate = useNavigate();

  const difficultyColor = {
    EASY: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HARD: "bg-red-500",
    EXTREME: "bg-purple-600",
  }[problem.difficulty];

  return (
    <div
      onClick={() => navigate(`/problems/${problem.id}`)}
      className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {problem.title}
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${difficultyColor}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-slate-400">
        {problem.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {problem.topics.map((t) => (
          <span
            key={t.topicId}
            className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
          >
            {t.topic.name}
          </span>
        ))}
      </div>
    </div>
  );
}