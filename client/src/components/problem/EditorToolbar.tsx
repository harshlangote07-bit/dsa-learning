interface EditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
}

export default function EditorToolbar({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  running,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3">

      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-slate-400">
          Language
        </span>

        <select
          value={language}
          onChange={(e) =>
            onLanguageChange(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

      </div>

      <div className="flex gap-3">

    <button
      disabled={running}
      onClick={onRun}
      className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-800"
    >
      {running ? "Running..." : "▶ Run"}
    </button>

        <button
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Submit
        </button>

      </div>

    </div>
  );
}