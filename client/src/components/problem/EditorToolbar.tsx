interface EditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  submitting: boolean;
}

export default function EditorToolbar({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  running,
  submitting,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3">

      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-slate-400">
          Language
        </span>

        <select
          value={language}
          disabled
          onChange={(e) =>
            onLanguageChange(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-80"
        >
          <option value="cpp">
            C++
          </option>
        </select>

      </div>

      <div className="flex gap-3">

        <button
          type="button"
          disabled={running || submitting}
          onClick={onRun}
          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-800"
        >
          {running
            ? "Running..."
            : "▶ Run"}
        </button>

        <button
          type="button"
          disabled={running || submitting}
          onClick={onSubmit}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
        >
          {submitting
            ? "Submitting..."
            : "Submit"}
        </button>

      </div>

    </div>
  );
}