// Hook: useErrorBoundary - Hook pour capturer les erreurs

import { logger } from "@/services/logger";
import { useEffect } from "react";

export const useErrorBoundary = (componentName: string) => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error("Uncaught error in component", event.error, componentName, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error("Unhandled promise rejection", event.reason, componentName, {
        promise: event.promise,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [componentName]);
};
