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

import type { DashboardResponse } from "../types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
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
      <div className="flex min-h-screen items-center justify-center">
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

    <h1 className="mb-2 text-4xl font-bold">
      Welcome, {dashboard.user.name} 👋
    </h1>

    <p className="mb-10 text-slate-400">
      Let's continue your DSA journey today.
    </p>

    {/* Stats Cards */}
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

    {/* Two Column Layout */}
    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">

      <section>

        <h2 className="mb-6 text-2xl font-bold">
          Topic Mastery
        </h2>

        <div className="space-y-4">

          {dashboard.mastery.map((item) => (
            <MasteryCard
              key={item.topicId}
              topic={item.topic.name}
              mastery={item.mastery}
            />
          ))}

        </div>

      </section>

      <section>

        <h2 className="mb-6 text-2xl font-bold">
          Recent Submissions
        </h2>

        <div className="space-y-4">

          {dashboard.recentSubmissions.map((submission) => (
            <RecentSubmissionCard
              key={submission.id}
              title={submission.problem.title}
              verdict={submission.verdict}
              difficulty={submission.problem.difficulty}
              submissionNumber={submission.submissionNumber}
            />
          ))}

        </div>

      </section>

    </div>

  </div>
);
}