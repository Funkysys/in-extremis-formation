/**
 * Tracking des ressources et navigation
 * Responsabilité : Resources et timing uniquement
 */

import type { PerformanceMetric } from "./types";

export class ResourceTracker {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  initTracking(): void {
    if (typeof window === "undefined") return;

    this.trackNavigation();
    this.trackResources();
    this.trackLongTasks();
  }

  private trackNavigation(): void {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          this.metrics.push({
            name: "Page Load",
            startTime: 0,
            endTime: navigation.loadEventEnd,
            duration: navigation.loadEventEnd - navigation.fetchStart,
            type: "navigation",
            metadata: {
              domContentLoaded:
                navigation.domContentLoadedEventEnd - navigation.fetchStart,
              ttfb: navigation.responseStart - navigation.fetchStart,
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
            },
          });
        }
      }, 0);
    });
  }

  private trackResources(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.duration < 10) continue;

          this.metrics.push({
            name: resourceEntry.name,
            startTime: resourceEntry.startTime,
            endTime: resourceEntry.startTime + resourceEntry.duration,
            duration: resourceEntry.duration,
            type: "custom",
            metadata: {
              resourceType: resourceEntry.initiatorType,
              size: resourceEntry.transferSize,
              cached: resourceEntry.transferSize === 0,
            },
          });
        }
      });
      resourceObserver.observe({ entryTypes: ["resource"] });
      this.observers.set("resource", resourceObserver);
    } catch {
      console.warn("Resource observer not supported");
    }
  }

  private trackLongTasks(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.push({
            name: "Long Task",
            startTime: entry.startTime,
            endTime: entry.startTime + entry.duration,
            duration: entry.duration,
            type: "custom",
            metadata: { warning: "Task took longer than 50ms" },
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
      this.observers.set("longtask", longTaskObserver);
    } catch {
      console.warn("Long task observer not supported");
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
