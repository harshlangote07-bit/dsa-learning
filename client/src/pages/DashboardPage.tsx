import { useEffect, useState } from "react";
import {
  BookOpen,
  FileCode,
  CheckCircle,
  Target,
} from "lucide-react";

import { getDashboard } from "../services/dashboard.api";

import StatCard from "../components/ui/StatCard";
import MasteryCard from "../components/ui/MasteryCard";
import RecentSubmissionCard from "../components/ui/RecentSubmissionCard";
import RecommendationCard from "../components/recommendation/RecommendationCard";

import type { DashboardResponse } from "../types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboard();

        setDashboard(response.data);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="text-white">
      {/* Header */}
      <h1 className="mb-2 text-4xl font-bold">
        Welcome, {dashboard.user.name} 👋
      </h1>

      <p className="mb-10 text-slate-400">
        Let's continue your DSA journey today.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Problems Solved"
          value={dashboard.stats.problemsSolved}
          icon={<BookOpen size={28} />}
        />

        <StatCard
          title="Submissions"
          value={dashboard.stats.totalSubmissions}
          icon={<FileCode size={28} />}
        />

        <StatCard
          title="Accepted"
          value={dashboard.stats.acceptedSubmissions}
          icon={<CheckCircle size={28} />}
        />

        <StatCard
          title="Acceptance Rate"
          value={`${dashboard.stats.acceptanceRate}%`}
          icon={<Target size={28} />}
        />
      </div>

      {/* Topic Mastery + Recent Submissions */}

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Topic Mastery */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">
            Topic Mastery
          </h2>

          <div className="space-y-4">
            {dashboard.mastery.map((item) => (
              <MasteryCard
                key={item.topic.id}
                topic={item.topic.name}
                mastery={item.mastery}
              />
            ))}
          </div>
        </section>

        {/* Recent Submissions */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">
            Recent Submissions
          </h2>

          <div className="space-y-4">
            {dashboard.recentSubmissions.map(
              (submission) => (
                <RecentSubmissionCard
                  key={submission.id}
                  id={submission.id}
                  title={submission.problem.title}
                  verdict={submission.verdict}
                  difficulty={
                    submission.problem.difficulty
                  }
                  submissionNumber={
                    submission.submissionNumber
                  }
                />
              )
            )}
          </div>
        </section>

      </div>

      {/* Recommendations */}

      <section className="mt-12">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Recommended Problems
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Problems selected based on your learning progress.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {dashboard.recommendations.map(
            (recommendation) => (
              <RecommendationCard
                key={recommendation.problemId}
                recommendation={recommendation}
              />
            )
          )}
        </div>

      </section>
    </div>
  );
}