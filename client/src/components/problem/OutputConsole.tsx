interface OutputConsoleProps {
  output: string;
}

export default function OutputConsole({
  output,
}: OutputConsoleProps) {
  return (
    <div className="h-44 border-t border-slate-800 bg-slate-950 p-4">

      <h2 className="mb-3 text-sm font-semibold text-slate-400">
        Output
      </h2>

      <pre className="h-full overflow-auto whitespace-pre-wrap rounded-lg bg-black p-4 font-mono text-sm text-green-400">
        {output || "Click Run to execute your code..."}
      </pre>

    </div>
  );
}