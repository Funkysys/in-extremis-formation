/**
 * Service de monitoring de performance
 * Responsabilité : Orchestration uniquement
 */

import { PerformanceMeasurer } from "./performance/PerformanceMeasurer";
import { ResourceTracker } from "./performance/ResourceTracker";
import type { MetricType, PerformanceMetric } from "./performance/types";
import { WebVitalsTracker } from "./performance/WebVitalsTracker";

class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private measurer = new PerformanceMeasurer();
  private resourceTracker = new ResourceTracker();
  private webVitalsTracker = new WebVitalsTracker();

  private constructor() {
    if (typeof window !== "undefined") {
      this.resourceTracker.initTracking();

      window.addEventListener("load", () => {
        this.webVitalsTracker.trackWebVitals();
      });
    }
  }

  static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  startMeasure(name: string, type: MetricType = "custom"): () => void {
    return this.measurer.startMeasure(name, type);
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    type: MetricType = "custom"
  ): Promise<T> {
    return this.measurer.measureAsync(name, fn, type);
  }

  getMetrics(type?: MetricType): PerformanceMetric[] {
    const allMetrics = [
      ...this.measurer.getMetrics(),
      ...this.resourceTracker.getMetrics(),
      ...this.webVitalsTracker.getMetrics(),
    ];

    return type ? allMetrics.filter((m) => m.type === type) : allMetrics;
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics();
    const filtered = metrics.filter((m) => m.name === name && m.duration);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + (m.duration || 0), 0);
    return sum / filtered.length;
  }

  clearMetrics(): void {
    this.measurer.clear();
  }

  exportMetrics(): string {
    return JSON.stringify(this.getMetrics(), null, 2);
  }

  dispose(): void {
    this.resourceTracker.dispose();
    this.webVitalsTracker.dispose();
  }
}

export const performanceMonitor =
  typeof window !== "undefined"
    ? PerformanceMonitorService.getInstance()
    : ({
        startMeasure: () => () => {},
        measureAsync: async <T>(_name: string, fn: () => Promise<T>) => fn(),
        getMetrics: () => [],
        getAverageMetric: () => 0,
        clearMetrics: () => {},
        exportMetrics: () => "{}",
        dispose: () => {},
      } as unknown as PerformanceMonitorService);
