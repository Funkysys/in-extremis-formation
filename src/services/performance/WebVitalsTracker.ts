/**
 * Tracking des Web Vitals (LCP, FID, CLS)
 * Responsabilité : Core Web Vitals uniquement
 */

import type { PerformanceMetric } from "./types";

export class WebVitalsTracker {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  trackWebVitals(): void {
    if (!("PerformanceObserver" in window)) return;

    this.trackLCP();
    this.trackFID();
    this.trackCLS();
  }

  private trackLCP(): void {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.metrics.push({
          name: "LCP (Largest Contentful Paint)",
          startTime: 0,
          endTime: lastEntry.startTime,
          duration: lastEntry.startTime,
          type: "custom",
          metadata: {
            score:
              lastEntry.startTime < 2500
                ? "good"
                : lastEntry.startTime < 4000
                ? "needs-improvement"
                : "poor",
          },
        });
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.set("lcp", lcpObserver);
    } catch {
      console.warn("LCP observer not supported");
    }
  }

  private trackFID(): void {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & {
            processingStart?: number;
          };
          const delay = (fidEntry.processingStart || 0) - fidEntry.startTime;

          this.metrics.push({
            name: "FID (First Input Delay)",
            startTime: fidEntry.startTime,
            endTime: fidEntry.startTime + delay,
            duration: delay,
            type: "custom",
            metadata: {
              score:
                delay < 100
                  ? "good"
                  : delay < 300
                  ? "needs-improvement"
                  : "poor",
            },
          });
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.set("fid", fidObserver);
    } catch {
      console.warn("FID observer not supported");
    }
  }

  private trackCLS(): void {
    try {
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!clsEntry.hadRecentInput) {
            clsScore += clsEntry.value || 0;
          }
        }

        this.metrics.push({
          name: "CLS (Cumulative Layout Shift)",
          startTime: 0,
          endTime: Date.now(),
          duration: clsScore,
          type: "custom",
          metadata: {
            score:
              clsScore < 0.1
                ? "good"
                : clsScore < 0.25
                ? "needs-improvement"
                : "poor",
            value: clsScore,
          },
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.set("cls", clsObserver);
    } catch {
      console.warn("CLS observer not supported");
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  dispose(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}
