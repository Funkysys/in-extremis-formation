// Service: Logger - Service de logging centralisé

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  stack?: string;
}

class LoggerService {
  private static instance: LoggerService;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Limite de logs en mémoire
  private isDevelopment = process.env.NODE_ENV === "development";

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);

    // Limiter la taille des logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Envoyer au serveur si en production
    if (
      !this.isDevelopment &&
      (entry.level === "error" || entry.level === "warn")
    ) {
      this.sendToServer(entry);
    }
  }

  private sendToServer(entry: LogEntry) {
    // TODO: Implémenter l'envoi vers un service de logging (Sentry, LogRocket, etc.)
    if (typeof window !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(entry)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/logs", blob);
    }
  }

  debug(message: string, context?: string, data?: unknown) {
    const entry = this.formatMessage("debug", message, context, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.debug(
        `[DEBUG] ${context ? `[${context}] ` : ""}${message}`,
        data || ""
      );
    }
  }

  info(message: string, context?: string, data?: unknown) {
    const entry = this.formatMessage("info", message, context, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.info(
        `[INFO] ${context ? `[${context}] ` : ""}${message}`,
        data || ""
      );
    }
  }

  warn(message: string, context?: string, data?: unknown) {
    const entry = this.formatMessage("warn", message, context, data);
    this.addLog(entry);

    console.warn(
      `[WARN] ${context ? `[${context}] ` : ""}${message}`,
      data || ""
    );
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: string,
    data?: unknown
  ) {
    const errorData: Record<string, unknown> = {};

    if (data && typeof data === "object" && !Array.isArray(data)) {
      Object.assign(errorData, data);
    }

    if (error instanceof Error) {
      errorData.errorMessage = error.message;
      errorData.errorStack = error.stack;
    }

    const entry = this.formatMessage("error", message, context, errorData);

    if (error instanceof Error) {
      entry.stack = error.stack;
    }

    this.addLog(entry);

    console.error(
      `[ERROR] ${context ? `[${context}] ` : ""}${message}`,
      error,
      data || ""
    );
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = LoggerService.getInstance();
