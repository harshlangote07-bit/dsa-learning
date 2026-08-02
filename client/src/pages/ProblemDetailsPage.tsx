import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProblemById } from "../services/problem.api";
import CodeEditor from "../components/problem/CodeEditor";

import type { Problem } from "../types/problem";

export default function ProblemDetailsPage() {
  const { id } = useParams();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      if (!id) return;

      try {
        const response = await getProblemById(id);
        setProblem(response.data);
      } catch {
        setError("Failed to load problem.");
      } finally {
        setLoading(false);
      }
    }

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        {error || "Problem not found"}
      </div>
    );
  }

  const difficultyColor = {
    EASY: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HARD: "bg-red-500",
    EXTREME: "bg-purple-600",
  }[problem.difficulty];

return (
  <div className="grid h-[calc(100vh-8rem)] grid-cols-2 gap-6 text-white">

    {/* Left Panel */}
    <div className="overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-8">

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          {problem.title}
        </h1>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold text-white ${difficultyColor}`}
        >
          {problem.difficulty}
        </span>

      </div>

      <h2 className="mb-3 text-xl font-semibold">
        Description
      </h2>

      <p className="leading-8 text-slate-300">
        {problem.description}
      </p>

      <div className="mt-8">

        <h2 className="mb-4 text-xl font-semibold">
          Topics
        </h2>

        <div className="flex flex-wrap gap-3">

          {problem.topics.map((topic) => (
            <span
              key={topic.topicId}
              className="rounded-full bg-slate-800 px-4 py-2 text-sm"
            >
              {topic.topic.name}
            </span>
          ))}

        </div>

      </div>

    </div>

    {/* Right Panel */}
    <CodeEditor />

  </div>
);
}