import { formatSAR } from "@/lib/zatca";

interface Month {
  label: string;
  value: number;
}

export function RevenueChart({ data, title, emptyLabel }: { data: Month[]; title: string; emptyLabel: string }) {
  const max = Math.max(1, ...data.map(d => d.value));
  const hasData = data.some(d => d.value > 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        {hasData && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatSAR(data.reduce((s, d) => s + d.value, 0))}
          </p>
        )}
      </div>
      {hasData ? (
        <div className="flex items-end justify-between gap-2 h-32" dir="ltr">
          {data.map(d => {
            const pct = (d.value / max) * 100;
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2 min-w-0">
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80 hover:bg-emerald-600 transition-colors"
                    style={{ height: `${pct}%`, minHeight: d.value > 0 ? "4px" : "0" }}
                    title={`${d.label}: ${formatSAR(d.value)}`}
                  />
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-center">{d.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">{emptyLabel}</p>
      )}
    </div>
  );
}
