interface MasteryCardProps {
  topic: string;
  mastery: number;
}

export default function MasteryCard({
  topic,
  mastery,
}: MasteryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-md transition hover:border-blue-500 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {topic}
        </h3>

        <span className="text-sm font-medium text-slate-300">
          {mastery.toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${mastery}%`,
          }}
        />
      </div>
    </div>
  );
}