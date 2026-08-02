import { useEffect, useState } from "react";

import { getRecommendations } from "../services/recommendation.api";
import RecommendationCard from "../components/recommendation/RecommendationCard";

import type { Recommendation } from "../types/recommendation";

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await getRecommendations();

        setRecommendations(response.data);
      } catch {
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        Loading Recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Recommended Problems
        </h1>

        <p className="mt-2 text-slate-400">
          Personalized recommendations based on your learning progress.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <h2 className="text-3xl font-bold">
            🎉 You're All Caught Up!
          </h2>

          <p className="mt-4 text-slate-400">
            No recommendations are available right now.
            Solve more problems and check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.problemId}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}
    </div>
  );
}