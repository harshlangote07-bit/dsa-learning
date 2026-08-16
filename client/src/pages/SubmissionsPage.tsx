import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  Code2,
  Eye,
} from "lucide-react";

import {
  getSubmissions,
  type Submission,
} from "../services/submission.api";

type Verdict = Submission["verdict"];

export default function SubmissionsPage() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  async function fetchSubmissions(
    currentPage: number
  ) {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSubmissions(
          currentPage,
          10
        );

      setSubmissions(response.data);

      setTotalPages(
        response.pagination.totalPages
      );
    } catch {
      setError(
        "Failed to load submissions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubmissions(page);
  }, [page]);

  function getVerdictStyles(
    verdict: Verdict
  ) {
    switch (verdict) {
      case "AC":
        return {
          icon: (
            <CheckCircle2
              size={17}
            />
          ),
          className:
            "border-green-500/20 bg-green-500/10 text-green-400",
        };

      case "WA":
        return {
          icon: (
            <XCircle
              size={17}
            />
          ),
          className:
            "border-red-500/20 bg-red-500/10 text-red-400",
        };

      case "TLE":
        return {
          icon: (
            <Clock3
              size={17}
            />
          ),
          className:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        };

      case "MLE":
      case "RE":
      case "CE":
        return {
          icon: (
            <AlertCircle
              size={17}
            />
          ),
          className:
            "border-orange-500/20 bg-orange-500/10 text-orange-400",
        };

      default:
        return {
          icon: (
            <AlertCircle
              size={17}
            />
          ),
          className:
            "border-slate-700 bg-slate-800 text-slate-400",
        };
    }
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading submissions...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <AlertCircle
            size={40}
            className="mx-auto mb-4 text-red-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Unable to load submissions
          </h2>

          <p className="mt-2 text-sm text-red-300">
            {error}
          </p>

          <button
            onClick={() =>
              fetchSubmissions(page)
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="text-white">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <Code2 size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Submissions
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              View your coding submission history.
            </p>
          </div>

        </div>

      </div>

      {/* ============================= */}
      {/* EMPTY STATE */}
      {/* ============================= */}

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

          <Code2
            size={45}
            className="mx-auto mb-4 text-slate-600"
          />

          <h2 className="text-xl font-semibold text-white">
            No submissions yet
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Solve a problem and your submissions will appear here.
          </p>

          <button
            onClick={() =>
              navigate("/problems")
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Problems
          </button>

        </div>
      ) : (
        <>
          {/* ============================= */}
          {/* DESKTOP TABLE */}
          {/* ============================= */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-slate-800 bg-slate-950/50">

                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-5 py-4">
                      Problem
                    </th>

                    <th className="px-5 py-4">
                      Verdict
                    </th>

                    <th className="px-5 py-4">
                      Language
                    </th>

                    <th className="px-5 py-4">
                      Attempt
                    </th>

                    <th className="px-5 py-4">
                      Hints
                    </th>

                    <th className="px-5 py-4">
                      Time
                    </th>

                    <th className="px-5 py-4">
                      Submitted
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {submissions.map(
                    (submission) => {
                      const verdict =
                        getVerdictStyles(
                          submission.verdict
                        );

                      return (
                        <tr
                          key={
                            submission.id
                          }
                          className="transition hover:bg-slate-800/40"
                        >

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                navigate(
                                  `/problems/${submission.problem.id}`
                                )
                              }
                              className="text-left"
                            >

                              <p className="font-semibold text-white hover:text-blue-400">
                                {
                                  submission
                                    .problem
                                    .title
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  submission
                                    .problem
                                    .difficulty
                                }
                              </p>

                            </button>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${verdict.className}`}
                            >
                              {verdict.icon}
                              {
                                submission.verdict
                              }
                            </span>

                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {
                              submission.language
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            #
                            {
                              submission.submissionNumber
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {
                              submission.hintsViewed
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {
                              submission.executionTime
                            }{" "}
                            ms
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                            {formatDate(
                              submission.submittedAt
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                navigate(
                                  `/submissions/${submission.id}`
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                              title="View submission"
                            >
                              <Eye
                                size={18}
                              />
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ============================= */}
          {/* MOBILE CARDS */}
          {/* ============================= */}

          <div className="space-y-4 md:hidden">

            {submissions.map(
              (submission) => {
                const verdict =
                  getVerdictStyles(
                    submission.verdict
                  );

                return (
                  <div
                    key={
                      submission.id
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <button
                          onClick={() =>
                            navigate(
                              `/problems/${submission.problem.id}`
                            )
                          }
                          className="text-left text-lg font-semibold text-white"
                        >
                          {
                            submission
                              .problem
                              .title
                          }
                        </button>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            submission
                              .problem
                              .difficulty
                          }
                          {" · "}
                          Attempt #
                          {
                            submission.submissionNumber
                          }
                        </p>

                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${verdict.className}`}
                      >
                        {verdict.icon}
                        {
                          submission.verdict
                        }
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <InfoItem
                        label="Language"
                        value={
                          submission.language
                        }
                      />

                      <InfoItem
                        label="Hints"
                        value={
                          submission.hintsViewed
                        }
                      />

                      <InfoItem
                        label="Execution"
                        value={`${submission.executionTime} ms`}
                      />

                      <InfoItem
                        label="Score"
                        value={
                          submission.score
                        }
                      />

                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">

                      <span className="text-xs text-slate-500">
                        {formatDate(
                          submission.submittedAt
                        )}
                      </span>

                      <button
                        onClick={() =>
                          navigate(
                            `/submissions/${submission.id}`
                          )
                        }
                        className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        <Eye
                          size={16}
                        />
                        View
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* ============================= */}
          {/* PAGINATION */}
          {/* ============================= */}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-400">
                Page {page} of{" "}
                {totalPages}
              </span>

              <button
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

        </>
      )}

    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | number;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-lg bg-slate-950 p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">
        {value}
      </p>

    </div>
  );
}