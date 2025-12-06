interface DebuggerHeaderProps {
  onClose: () => void;
}

export function DebuggerHeader({ onClose }: DebuggerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 className="text-lg font-bold">Performance Debugger</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        ✕
      </button>
    </div>
  );
}
