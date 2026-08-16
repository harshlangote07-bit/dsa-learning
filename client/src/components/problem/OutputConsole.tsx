interface OutputConsoleProps {
  output: string;
}

export default function OutputConsole({
  output,
}: OutputConsoleProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-t border-slate-800 bg-slate-950 p-4">

      <h2 className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Output
      </h2>

      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-black p-4 font-mono text-sm leading-6 text-green-400">
        {output ||
          "Click Run to execute your code..."}
      </pre>

    </div>
  );
}