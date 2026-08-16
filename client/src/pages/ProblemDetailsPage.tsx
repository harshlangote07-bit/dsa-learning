import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  CheckCircle2,
  CircleAlert,
  Code2,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";

import {
  getHints,
  viewHint,
} from "../services/hint.api";

import type { Hint } from "../types/hint";

import {
  getProblemById,
  getProblemProgress,
} from "../services/problem.api";

import CodeEditor from "../components/problem/CodeEditor";

import type {
  Problem,
  ProblemProgress,
} from "../types/problem";

export default function ProblemDetailsPage() {
  const { id } = useParams();

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [progress, setProgress] =
    useState<ProblemProgress | null>(null);

  const [hints, setHints] =
    useState<Hint[]>([]);

  const [hintsViewed, setHintsViewed] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchProblemData() {
      if (!id) {
        setError("Invalid problem ID.");
        setLoading(false);
        return;
      }

      try {
        const [
          problemResponse,
          progressResponse,
          hintsResponse,
        ] = await Promise.all([
          getProblemById(id),
          getProblemProgress(id),
          getHints(id),
        ]);

        setProblem(problemResponse.data);
        setProgress(progressResponse.data);
        setHints(hintsResponse.data);
      } catch {
        setError("Failed to load problem.");
      } finally {
        setLoading(false);
      }
    }

    fetchProblemData();
  }, [id]);

  async function refreshProgress() {
    if (!id) return;

    try {
      const response =
        await getProblemProgress(id);

      setProgress(response.data);
    } catch {
      // Progress refresh failure should not
      // break the entire problem page.
    }
  }

  async function handleViewHint(
    hintId: string
  ) {
    if (!id) return;

    try {
      const response = await viewHint(
        id,
        hintId
      );

      setHintsViewed(
        response.data.hintsViewed
      );
    } catch {
      setError("Failed to view hint.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading problem...
          </p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <CircleAlert
            size={42}
            className="mb-4 text-red-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Unable to load problem
          </h2>

          <p className="mt-2 text-sm text-red-300">
            {error || "Problem not found"}
          </p>
        </div>
      </div>
    );
  }

  const difficultyStyles = {
    EASY: {
      badge:
        "border-green-500/20 bg-green-500/10 text-green-400",
      dot: "bg-green-400",
    },

    MEDIUM: {
      badge:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
      dot: "bg-yellow-400",
    },

    HARD: {
      badge:
        "border-red-500/20 bg-red-500/10 text-red-400",
      dot: "bg-red-400",
    },

    EXTREME: {
      badge:
        "border-purple-500/20 bg-purple-500/10 text-purple-400",
      dot: "bg-purple-400",
    },
  } as const;

  const difficulty =
    difficultyStyles[problem.difficulty];

  const solved = progress?.solved ?? false;

  return (
<div className="flex h-[calc(100vh-7.5rem)] min-h-0 flex-col text-white">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <header className="mb-4 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 backdrop-blur">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Code2 size={15} />

              <span>Problem</span>

              <span className="text-slate-700">
                /
              </span>

              <span className="truncate">
                {problem.slug}
              </span>
            </div>

            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {problem.title}
            </h1>

          </div>

          <div className="flex shrink-0 items-center gap-3">

            {solved && (
              <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm font-semibold text-green-400">
                <CheckCircle2 size={16} />
                Solved
              </div>
            )}

            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${difficulty.badge}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${difficulty.dot}`}
              />

              {problem.difficulty}
            </div>

          </div>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN WORKSPACE */}
      {/* ================================================= */}

<div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(360px,0.85fr)_minmax(560px,1.35fr)]">
        {/* ================================================= */}
        {/* LEFT: PROBLEM PANEL */}
        {/* ================================================= */}

        <section className="min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

          <div className="h-full overflow-y-auto">

            <div className="space-y-6 p-5 sm:p-6">

              {/* Progress */}
              {progress && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <Target
                        size={18}
                        className="text-blue-400"
                      />

                      <h2 className="font-semibold text-white">
                        Your Progress
                      </h2>
                    </div>

                    {progress.solved && (
                      <span className="text-xs font-semibold text-green-400">
                        Completed
                      </span>
                    )}

                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">

                    <ProgressItem
                      label="Attempts"
                      value={
                        progress.totalSubmissions
                      }
                    />

                    <ProgressItem
                      label="Accepted"
                      value={
                        progress.acceptedSubmissions
                      }
                      valueClass="text-green-400"
                    />

                    <ProgressItem
                      label="Status"
                      value={
                        progress.solved
                          ? "Solved"
                          : progress.attempted
                          ? "Attempted"
                          : "New"
                      }
                      valueClass={
                        progress.solved
                          ? "text-green-400"
                          : progress.attempted
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }
                    />

                    <ProgressItem
                      label="Latest"
                      value={
                        progress.latestVerdict ??
                        "—"
                      }
                      valueClass={
                        progress.latestVerdict ===
                        "AC"
                          ? "text-green-400"
                          : progress.latestVerdict
                          ? "text-red-400"
                          : "text-slate-300"
                      }
                    />

                  </div>

                </div>
              )}

              {/* Description */}
              <section>

                <SectionHeader
                  icon={
                    <Code2
                      size={18}
                    />
                  }
                  title="Description"
                />

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300 sm:text-[15px]">
                    {problem.description}
                  </p>

                </div>

              </section>

              {/* Topics */}
              <section>

                <SectionHeader
                  icon={
                    <Sparkles
                      size={18}
                    />
                  }
                  title="Topics"
                />

                <div className="flex flex-wrap gap-2">

                  {problem.topics.map(
                    (topic) => (
                      <span
                        key={
                          topic.topicId
                        }
                        className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                      >
                        {topic.topic.name}
                      </span>
                    )
                  )}

                </div>

              </section>

              {/* Hints */}
              <section>

                <div className="mb-4 flex items-center justify-between">

                  <SectionHeader
                    icon={
                      <Sparkles
                        size={18}
                      />
                    }
                    title="Hints"
                  />

                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                    {hintsViewed}/{hints.length}
                  </span>

                </div>

                <div className="space-y-3">

                  {hints.map(
                    (hint, index) => {
                      const unlocked =
                        index <=
                        hintsViewed;

                      const viewed =
                        index <
                        hintsViewed;

                      return (
                        <div
                          key={hint.id}
                          className={`rounded-xl border p-4 transition ${
                            viewed
                              ? "border-blue-500/20 bg-blue-500/5"
                              : unlocked
                              ? "border-slate-700 bg-slate-950"
                              : "border-slate-800 bg-slate-950/50"
                          }`}
                        >

                          <div className="mb-3 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              {viewed ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-blue-400"
                                />
                              ) : unlocked ? (
                                <Sparkles
                                  size={16}
                                  className="text-yellow-400"
                                />
                              ) : (
                                <Lock
                                  size={16}
                                  className="text-slate-600"
                                />
                              )}

                              <span className="text-sm font-semibold text-slate-300">
                                Hint {hint.order}
                              </span>

                            </div>

                            {viewed && (
                              <span className="text-xs text-blue-400">
                                Viewed
                              </span>
                            )}

                          </div>

                          {viewed ? (
                            <p className="text-sm leading-6 text-slate-300">
                              {hint.content}
                            </p>
                          ) : unlocked ? (
                            <div>

                              <p className="mb-3 text-sm text-slate-500">
                                Need a little help?
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewHint(
                                    hint.id
                                  )
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                              >
                                View Hint
                              </button>

                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Lock
                                size={15}
                              />

                              <span>
                                View the previous hint to unlock this one.
                              </span>
                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

              </section>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* RIGHT: CODE EDITOR */}
        {/* ================================================= */}

        <section className="min-h-[650px] min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl xl:min-h-0">

          <CodeEditor
            problemId={problem.id}
            onSubmissionComplete={
              refreshProgress
            }
          />

        </section>

      </div>

    </div>
  );
}

/* ===================================================== */
/* SMALL UI COMPONENTS */
/* ===================================================== */

interface ProgressItemProps {
  label: string;
  value: string | number;
  valueClass?: string;
}

function ProgressItem({
  label,
  value,
  valueClass = "text-white",
}: ProgressItemProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">

      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-lg font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({
  icon,
  title,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center gap-2">

      <span className="text-blue-400">
        {icon}
      </span>

      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

    </div>
  );
}