/**
 * Types pour le monitoring de performance
 */

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: "navigation" | "component" | "api" | "custom";
  metadata?: Record<string, unknown>;
}

export type MetricType = PerformanceMetric["type"];
