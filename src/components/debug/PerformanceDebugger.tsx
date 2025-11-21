// Component: PerformanceDebugger - Composant de debug des performances (dev only)

"use client";

import { logger } from "@/services/logger";
import { performanceMonitor } from "@/services/performanceMonitor";
import { useEffect, useState } from "react";

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: string;
  metadata?: Record<string, unknown>;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  data?: unknown;
  stack?: string;
}

export const PerformanceDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"metrics" | "logs">("metrics");

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Afficher uniquement en dev
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Ouvrir le debugger de performance"
      >
        📊 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white rounded-lg shadow-2xl w-[600px] max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Performance Debugger</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 px-4 py-2 font-medium transition-colors ${
            activeTab === "metrics"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Métriques ({metrics.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 px-4 py-2 font-medium transition-colors ${
            activeTab === "logs"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Logs ({logs.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "metrics" && (
          <div className="space-y-2">
            {metrics.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune métrique</p>
            ) : (
              metrics
                .slice(-20)
                .reverse()
                .map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded p-3 text-sm border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-blue-400">
                        {metric.name}
                      </span>
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
                ))
            )}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucun log</p>
            ) : (
              logs
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
                ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 p-4 border-t border-gray-700">
        <button
          onClick={() => {
            if (activeTab === "metrics") {
              performanceMonitor.clearMetrics();
              setMetrics([]);
            } else {
              logger.clearLogs();
              setLogs([]);
            }
          }}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Effacer
        </button>
        <button
          onClick={() => {
            const data =
              activeTab === "metrics"
                ? performanceMonitor.exportMetrics()
                : logger.exportLogs();

            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${activeTab}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
        >
          Exporter
        </button>
      </div>
    </div>
  );
};
