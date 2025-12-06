interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  data?: unknown;
  stack?: string;
}

interface LogsListProps {
  logs: LogEntry[];
}

export function LogsList({ logs }: LogsListProps) {
  if (logs.length === 0) {
    return <p className="text-gray-400 text-center py-8">Aucun log</p>;
  }

  return (
    <div className="space-y-2">
      {logs
        .slice(-50)
        .reverse()
        .map((log, index) => (
          <div
            key={index}
            className={`rounded p-3 text-sm border ${
              log.level === "error"
                ? "bg-red-900/20 border-red-700"
                : log.level === "warn"
                ? "bg-yellow-900/20 border-yellow-700"
                : log.level === "info"
                ? "bg-blue-900/20 border-blue-700"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={`text-xs px-2 py-1 rounded font-bold ${
                  log.level === "error"
                    ? "bg-red-700 text-white"
                    : log.level === "warn"
                    ? "bg-yellow-700 text-white"
                    : log.level === "info"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {log.level.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {log.context && (
              <div className="text-xs text-purple-400 mb-1">
                [{log.context}]
              </div>
            )}
            <div className="text-white">{log.message}</div>
            {log.data !== undefined && log.data !== null && (
              <pre className="text-xs text-gray-400 mt-2 overflow-auto max-h-32">
                {(() => {
                  try {
                    return typeof log.data === "object"
                      ? JSON.stringify(log.data, null, 2)
                      : String(log.data);
                  } catch {
                    return "[Non-serializable data]";
                  }
                })()}
              </pre>
            )}
          </div>
        ))}
    </div>
  );
}
