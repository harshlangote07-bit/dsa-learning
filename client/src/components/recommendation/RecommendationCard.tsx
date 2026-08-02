import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Recommendation } from "../../types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const navigate = useNavigate();

  const difficultyColor = {
    EASY: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HARD: "bg-red-500",
    EXTREME: "bg-purple-600",
  }[recommendation.difficulty];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Sparkles
            size={24}
            className="text-yellow-400"
          />

          <h2 className="text-xl font-semibold text-white">
            {recommendation.title}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${difficultyColor}`}
        >
          {recommendation.difficulty}
        </span>

      </div>

      <div className="mb-5">

        <p className="text-sm text-slate-400">
          Match Score
        </p>

        <h3 className="mt-1 text-3xl font-bold text-blue-400">
          {recommendation.score.toFixed(1)}%
        </h3>

      </div>

      <div className="mb-6">

        <p className="text-sm text-slate-400">
          Why this problem?
        </p>

        <p className="mt-2 text-slate-200">
          {recommendation.reason}
        </p>

      </div>

      <button
        onClick={() =>
          navigate(`/problems/${recommendation.problemId}`)
        }
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Solve Problem →
      </button>

    </div>
  );
}