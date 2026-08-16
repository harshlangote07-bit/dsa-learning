import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import CreateProblemForm from "../features/admin/CreateProblemForm";

import { getProblems } from "../services/problem.api";

import { deleteProblem } from "../services/admin.api";

import type { Problem } from "../types/problem";

export default function AdminDashboardPage() {
  const [problems, setProblems] = useState<Problem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [editingProblem, setEditingProblem] =
    useState<Problem | null>(null);

  async function fetchProblems() {
    try {
      setLoading(true);
      setError("");

      const response = await getProblems();

      setProblems(response.data);
    } catch {
      setError("Failed to load problems.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  async function handleDelete(problem: Problem) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${problem.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(problem.id);
      setError("");

      await deleteProblem(problem.id);

      setProblems((current) =>
        current.filter(
          (item) => item.id !== problem.id
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to delete problem."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const difficultyColor = {
    EASY: "text-green-400",
    MEDIUM: "text-yellow-400",
    HARD: "text-red-400",
    EXTREME: "text-purple-400",
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">

      {/* =========================
          Header
      ========================== */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage problems and learning content.
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            setShowCreateForm(true)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Problem
        </button>

      </div>

      {/* =========================
          Error
      ========================== */}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <div className="flex items-center gap-3">

            <AlertCircle
              size={20}
              className="shrink-0 text-red-400"
            />

            <p className="text-sm text-red-300">
              {error}
            </p>

          </div>

          <button
            onClick={fetchProblems}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <RefreshCw size={15} />
            Retry
          </button>

        </div>
      )}

      {/* =========================
          Stats
      ========================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Total Problems
          </p>

          <p className="mt-2 text-3xl font-bold">
            {problems.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Easy
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {
              problems.filter(
                (problem) =>
                  problem.difficulty === "EASY"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Hard / Extreme
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            {
              problems.filter(
                (problem) =>
                  problem.difficulty === "HARD" ||
                  problem.difficulty === "EXTREME"
              ).length
            }
          </p>
        </div>

      </div>

      {/* =========================
          Problems
      ========================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 px-6 py-5">

          <h2 className="text-xl font-bold">
            Problems
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Create, edit, and delete problems.
          </p>

        </div>

        {problems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">
              No problems found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">

            {problems.map((problem) => (
              <div
                key={problem.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* Problem information */}

                <div className="min-w-0">

                  <h3 className="truncate font-semibold text-white">
                    {problem.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3">

                    <span
                      className={`text-sm font-semibold ${difficultyColor[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </span>

                    <span className="text-xs text-slate-600">
                      •
                    </span>

                    <span className="text-sm text-slate-400">
                      {problem.slug}
                    </span>

                    <span className="text-xs text-slate-600">
                      •
                    </span>

                    <span className="text-sm text-slate-400">
                      {problem.topics.length}{" "}
                      topic
                      {problem.topics.length === 1
                        ? ""
                        : "s"}
                    </span>

                  </div>

                </div>

                {/* Actions */}

                <div className="flex shrink-0 items-center gap-2">

                  <button
                    onClick={() =>
                        setEditingProblem(problem)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                    >
                    <Pencil size={16} />
                    Edit
                 </button>

                  <button
                    disabled={
                      deletingId === problem.id
                    }
                    onClick={() =>
                      handleDelete(problem)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deletingId === problem.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* =========================
          Create Problem Modal
      ========================== */}

      {showCreateForm && (
        <CreateProblemForm
          onCancel={() =>
            setShowCreateForm(false)
          }
          onCreated={async () => {
            setShowCreateForm(false);

            await fetchProblems();
          }}
        />
      )}

      {editingProblem && (
        <CreateProblemForm
            problem={editingProblem}
            onCancel={() =>
            setEditingProblem(null)
            }
            onCreated={async () => {
            setEditingProblem(null);
            await fetchProblems();
            }}
        />
        )}

    </div>
  );
}