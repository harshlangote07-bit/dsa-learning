import { useEffect, useState } from "react";

import {
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getRecommendations } from "../services/recommendation.api";
import RecommendationCard from "../components/recommendation/RecommendationCard";

import type { Recommendation } from "../types/recommendation";

export default function RecommendationPage() {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRecommendations() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getRecommendations();

      setRecommendations(response.data);
    } catch {
      setError(
        "Failed to load recommendations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto mb-4 text-red-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Unable to load recommendations
          </h2>

          <p className="mt-2 text-sm text-red-300">
            {error}
          </p>

          <button
            onClick={fetchRecommendations}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="text-white">

      {/* Header */}

      <div className="mb-10">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
            <Sparkles size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Recommended Problems
            </h1>

            <p className="mt-2 text-slate-400">
              Personalized recommendations based on your learning progress.
            </p>
          </div>

        </div>

      </div>

      {/* Empty state */}

      {recommendations.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

          <Sparkles
            size={45}
            className="mx-auto mb-5 text-yellow-400"
          />

          <h2 className="text-2xl font-bold text-white">
            🎉 You're All Caught Up!
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            No recommendations are available right now.
            Solve more problems and check back later.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">

          {recommendations.map(
            (recommendation) => (
              <RecommendationCard
                key={
                  recommendation.problemId
                }
                recommendation={
                  recommendation
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
}