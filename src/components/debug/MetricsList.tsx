interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: string;
  metadata?: Record<string, unknown>;
}

interface MetricsListProps {
  metrics: PerformanceMetric[];
}

export function MetricsList({ metrics }: MetricsListProps) {
  if (metrics.length === 0) {
    return <p className="text-gray-400 text-center py-8">Aucune métrique</p>;
  }

  return (
    <div className="space-y-2">
      {metrics
        .slice(-20)
        .reverse()
        .map((metric, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded p-3 text-sm border border-gray-700"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-blue-400">{metric.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  metric.type === "navigation"
                    ? "bg-green-900 text-green-200"
                    : metric.type === "component"
                    ? "bg-purple-900 text-purple-200"
                    : metric.type === "api"
                    ? "bg-orange-900 text-orange-200"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {metric.type}
              </span>
            </div>
            {metric.duration && (
              <div
                className={`text-lg font-bold ${
                  metric.duration < 16
                    ? "text-green-400"
                    : metric.duration < 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {metric.duration.toFixed(2)}ms
              </div>
            )}
            {metric.metadata && (
              <pre className="text-xs text-gray-400 mt-2 overflow-auto max-h-32">
                {(() => {
                  try {
                    return JSON.stringify(metric.metadata, null, 2);
                  } catch {
                    return "[Non-serializable metadata]";
                  }
                })()}
              </pre>
            )}
          </div>
        ))}
    </div>
  );
}
