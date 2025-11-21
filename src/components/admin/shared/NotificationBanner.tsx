// Composant: NotificationBanner - Bannière de notification

interface NotificationBannerProps {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}

export const NotificationBanner = ({
  type,
  message,
  onClose,
}: NotificationBannerProps) => {
  const isError = type === "error";

  return (
    <div
      className={`${
        isError
          ? "bg-red-100 border-red-400 text-red-800"
          : "bg-green-100 border-green-400 text-green-800"
      } border px-4 py-3 rounded relative mb-4 flex items-center gap-2 animate-fade-in`}
    >
      <span className="text-lg">{isError ? "❌" : "✅"}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className={`ml-auto ${
          isError
            ? "text-red-700 hover:text-red-900"
            : "text-green-700 hover:text-green-900"
        } px-2 py-1 rounded focus:outline-none`}
      >
        ✕
      </button>
    </div>
  );
};
