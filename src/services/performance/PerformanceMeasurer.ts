/**
 * Mesures de performance manuelles
 * Responsabilité : API de mesure uniquement
 */

import type { MetricType, PerformanceMetric } from "./types";

export class PerformanceMeasurer {
  private metrics: PerformanceMetric[] = [];

  startMeasure(name: string, type: MetricType = "custom"): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.push({
        name,
        startTime,
        endTime,
        duration,
        type,
      });
    };
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    type: MetricType = "custom"
  ): Promise<T> {
    const stopMeasure = this.startMeasure(name, type);
    try {
      const result = await fn();
      stopMeasure();
      return result;
    } catch (error) {
      stopMeasure();
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}
