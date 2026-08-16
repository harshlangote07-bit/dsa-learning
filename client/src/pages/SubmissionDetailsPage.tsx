import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  Code2,
  Lightbulb,
} from "lucide-react";

import {
  getSubmissionById,
  type Submission,
} from "../services/submission.api";

export default function SubmissionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchSubmission() {
      if (!id) {
        setError("Invalid submission ID.");
        setLoading(false);
        return;
      }

      try {
        const response =
          await getSubmissionById(id);

        setSubmission(response.data);
      } catch {
        setError(
          "Failed to load submission."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSubmission();
  }, [id]);

  function getVerdictStyle(
    verdict: Submission["verdict"]
  ) {
    switch (verdict) {
      case "AC":
        return {
          icon: (
            <CheckCircle2 size={22} />
          ),
          className:
            "border-green-500/20 bg-green-500/10 text-green-400",
        };

      case "WA":
        return {
          icon: (
            <XCircle size={22} />
          ),
          className:
            "border-red-500/20 bg-red-500/10 text-red-400",
        };

      case "TLE":
        return {
          icon: (
            <Clock3 size={22} />
          ),
          className:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        };

      default:
        return {
          icon: (
            <AlertCircle size={22} />
          ),
          className:
            "border-orange-500/20 bg-orange-500/10 text-orange-400",
        };
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading submission...
          </p>

        </div>

      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto mb-4 text-red-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Unable to load submission
          </h2>

          <p className="mt-2 text-sm text-red-300">
            {error ||
              "Submission not found."}
          </p>

          <button
            onClick={() =>
              navigate("/submissions")
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Submissions
          </button>

        </div>

      </div>
    );
  }

  const verdict =
    getVerdictStyle(
      submission.verdict
    );

  return (
    <div className="text-white">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <button
          onClick={() =>
            navigate("/submissions")
          }
          className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="text-sm text-slate-500">
            Submission #{submission.submissionNumber}
          </p>

          <h1 className="text-3xl font-bold">
            {submission.problem.title}
          </h1>
        </div>

      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Verdict
          </p>

          <div
            className={`mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold ${verdict.className}`}
          >
            {verdict.icon}
            {submission.verdict}
          </div>

        </div>

        <InfoCard
          label="Language"
          value={submission.language}
        />

        <InfoCard
          label="Execution Time"
          value={`${submission.executionTime} ms`}
        />

        <InfoCard
          label="Hints Viewed"
          value={submission.hintsViewed}
          icon={
            <Lightbulb
              size={17}
            />
          }
        />

      </div>

      {/* Submission information */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex items-center gap-2">

            <Code2
              size={19}
              className="text-blue-400"
            />

            <h2 className="font-semibold">
              Submission Information
            </h2>

          </div>

          <div className="space-y-4">

            <DetailRow
              label="Problem"
              value={
                submission.problem.title
              }
            />

            <DetailRow
              label="Difficulty"
              value={
                submission.problem.difficulty
              }
            />

            <DetailRow
              label="Attempt"
              value={`#${submission.submissionNumber}`}
            />

            <DetailRow
              label="Score"
              value={submission.score}
            />

            <DetailRow
              label="Submitted"
              value={new Date(
                submission.submittedAt
              ).toLocaleString()}
            />

          </div>

          <button
            onClick={() =>
              navigate(
                `/problems/${submission.problem.id}`
              )
            }
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Open Problem
          </button>

        </div>

        {/* Code */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

            <div className="flex items-center gap-2">

              <Code2
                size={19}
                className="text-blue-400"
              />

              <h2 className="font-semibold">
                Submitted Code
              </h2>

            </div>

            <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              {submission.language}
            </span>

          </div>

          <div className="max-h-[600px] overflow-auto bg-slate-950">

            <pre className="min-w-max p-6 font-mono text-sm leading-7 text-slate-300">
              <code>
                {submission.code ||
                  "Code unavailable."}
              </code>
            </pre>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================================= */
/* Small reusable components */
/* ================================= */

interface InfoCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function InfoCard({
  label,
  value,
  icon,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-center gap-2">

        {icon && (
          <span className="text-yellow-400">
            {icon}
          </span>
        )}

        <p className="text-xl font-bold text-white">
          {value}
        </p>

      </div>

    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string | number;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-200">
        {value}
      </span>

    </div>
  );
}