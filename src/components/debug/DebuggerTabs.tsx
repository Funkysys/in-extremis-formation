interface DebuggerTabsProps {
  activeTab: "metrics" | "logs";
  onTabChange: (tab: "metrics" | "logs") => void;
  metricsCount: number;
  logsCount: number;
}

export function DebuggerTabs({
  activeTab,
  onTabChange,
  metricsCount,
  logsCount,
}: DebuggerTabsProps) {
  return (
    <div className="flex border-b border-gray-700">
      <button
        onClick={() => onTabChange("metrics")}
        className={`flex-1 px-4 py-2 font-medium transition-colors ${
          activeTab === "metrics"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Métriques ({metricsCount})
      </button>
      <button
        onClick={() => onTabChange("logs")}
        className={`flex-1 px-4 py-2 font-medium transition-colors ${
          activeTab === "logs"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Logs ({logsCount})
      </button>
    </div>
  );
}
