import { useNavigate } from "react-router-dom";

interface RecentSubmissionCardProps {
  id: string;
  title: string;
  verdict: string;
  difficulty: string;
  submissionNumber: number;
}

export default function RecentSubmissionCard({
  id,
  title,
  verdict,
  difficulty,
  submissionNumber,
}: RecentSubmissionCardProps) {
  const navigate = useNavigate();

  const verdictColor =
    verdict === "AC"
      ? "bg-green-500"
      : "bg-red-500";

  const difficultyColor = {
    EASY: "text-green-400",
    MEDIUM: "text-yellow-400",
    HARD: "text-red-400",
    EXTREME: "text-purple-400",
  }[difficulty] ?? "text-slate-300";

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/submissions/${id}`)
      }
      className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left shadow-md transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Submission #{submissionNumber}
          </p>
        </div>

        <div className="text-right">

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${verdictColor}`}
          >
            {verdict}
          </span>

          <p
            className={`mt-2 text-sm font-medium ${difficultyColor}`}
          >
            {difficulty}
          </p>

        </div>

      </div>
    </button>
  );
}