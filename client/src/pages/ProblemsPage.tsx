import { useEffect, useState } from "react";

import { getProblems } from "../services/problem.api";
import ProblemCard from "../components/problem/ProblemCard";

import type { Problem } from "../types/problem";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [topic, setTopic] = useState("ALL");

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await getProblems();
        setProblems(response.data);
      } catch {
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading Problems...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        {error}
      </div>
    );
  }

  const topics = [
    "ALL",
    ...new Set(
      problems.flatMap((problem) =>
        problem.topics.map((t) => t.topic.name)
      )
    ),
  ];

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "ALL" ||
      problem.difficulty === difficulty;

    const matchesTopic =
      topic === "ALL" ||
      problem.topics.some(
        (t) => t.topic.name === topic
      );

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesTopic
    );
  });

  return (
    <div >

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Problems
        </h1>

        <p className="mt-2 text-slate-400">
          Browse and solve DSA problems.
        </p>

      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">

        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="ALL">ALL</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
          <option value="EXTREME">EXTREME</option>
        </select>

        <select
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          {topics.map((t) => (
            <option
              key={t}
              value={t}
            >
              {t}
            </option>
          ))}
        </select>

      </div>

      {filteredProblems.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          No problems found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
            />
          ))}

        </div>
      )}

    </div>
  );
}