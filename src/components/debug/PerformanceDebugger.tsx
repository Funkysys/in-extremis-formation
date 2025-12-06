"use client";

import { logger } from "@/services/logger";
import { performanceMonitor } from "@/services/performanceMonitor";
import { useEffect, useState } from "react";
import { DebuggerFooter } from "./DebuggerFooter";
import { DebuggerHeader } from "./DebuggerHeader";
import { DebuggerTabs } from "./DebuggerTabs";
import { LogsList } from "./LogsList";
import { MetricsList } from "./MetricsList";

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

  const handleClear = () => {
    if (activeTab === "metrics") {
      performanceMonitor.clearMetrics();
      setMetrics([]);
    } else {
      logger.clearLogs();
      setLogs([]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white rounded-lg shadow-2xl w-[600px] max-h-[600px] flex flex-col">
      <DebuggerHeader onClose={() => setIsOpen(false)} />
      <DebuggerTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        metricsCount={metrics.length}
        logsCount={logs.length}
      />
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "metrics" ? (
          <MetricsList metrics={metrics} />
        ) : (
          <LogsList logs={logs} />
        )}
      </div>
      <DebuggerFooter activeTab={activeTab} onClear={handleClear} />
    </div>
  );
};
