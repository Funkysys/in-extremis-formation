import { logger } from "@/services/logger";
import { performanceMonitor } from "@/services/performanceMonitor";

interface DebuggerFooterProps {
  activeTab: "metrics" | "logs";
  onClear: () => void;
}

export function DebuggerFooter({ activeTab, onClear }: DebuggerFooterProps) {
  const handleExport = () => {
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
  };

  return (
    <div className="flex gap-2 p-4 border-t border-gray-700">
      <button
        onClick={onClear}
        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        Effacer
      </button>
      <button
        onClick={handleExport}
        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
      >
        Exporter
      </button>
    </div>
  );
}
