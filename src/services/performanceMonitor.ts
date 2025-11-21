// Service: PerformanceMonitor - Monitoring des performances

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: "navigation" | "component" | "api" | "custom";
  metadata?: Record<string, unknown>;
}

class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    if (typeof window !== "undefined") {
      this.initPerformanceObservers();
      this.trackNavigationTiming();
    }
  }

  static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  private initPerformanceObservers() {
    // Observer pour les ressources
    if ("PerformanceObserver" in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "resource") {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.trackResourceLoad(resourceEntry);
            }
          }
        });
        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.set("resource", resourceObserver);
      } catch {
        console.warn("Performance Observer not supported for resources");
      }

      // Observer pour les long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackLongTask(entry as PerformanceEntry);
          }
        });
        longTaskObserver.observe({ entryTypes: ["longtask"] });
        this.observers.set("longtask", longTaskObserver);
      } catch {
        console.warn("Performance Observer not supported for long tasks");
      }
    }
  }

  private trackNavigationTiming() {
    if (typeof window === "undefined" || !window.performance) return;

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
              domInteractive: navigation.domInteractive - navigation.fetchStart,
              ttfb: navigation.responseStart - navigation.fetchStart, // Time To First Byte
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              request: navigation.responseStart - navigation.requestStart,
              response: navigation.responseEnd - navigation.responseStart,
            },
          });

          // Envoyer les métriques Web Vitals
          this.trackWebVitals();
        }
      }, 0);
    });
  }

  private trackResourceLoad(entry: PerformanceResourceTiming) {
    // Ignorer les petites ressources
    if (entry.duration < 10) return;

    this.metrics.push({
      name: entry.name,
      startTime: entry.startTime,
      endTime: entry.startTime + entry.duration,
      duration: entry.duration,
      type: "custom",
      metadata: {
        resourceType: entry.initiatorType,
        size: entry.transferSize,
        cached: entry.transferSize === 0,
      },
    });
  }

  private trackLongTask(entry: PerformanceEntry) {
    this.metrics.push({
      name: "Long Task",
      startTime: entry.startTime,
      endTime: entry.startTime + entry.duration,
      duration: entry.duration,
      type: "custom",
      metadata: {
        warning: "Task took longer than 50ms",
      },
    });
  }

  private trackWebVitals() {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
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
              element: (lastEntry as PerformanceEntry & { element?: { tagName?: string } }).element?.tagName,
              url: (lastEntry as PerformanceEntry & { url?: string }).url,
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

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEntry & { processingStart?: number; name: string };
            this.metrics.push({
              name: "FID (First Input Delay)",
              startTime: fidEntry.startTime,
              endTime: fidEntry.startTime + (fidEntry.processingStart || 0),
              duration: (fidEntry.processingStart || 0) - fidEntry.startTime,
              type: "custom",
              metadata: {
                eventType: fidEntry.name,
                score:
                  fidEntry.processingStart < 100
                    ? "good"
                    : fidEntry.processingStart < 300
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

      // Cumulative Layout Shift (CLS)
      try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
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
  }

  // Méthode publique pour mesurer le temps d'exécution
  startMeasure(
    name: string,
    type: "component" | "api" | "custom" = "custom"
  ): () => void {
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

  // Méthode pour mesurer une fonction async
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    type: "component" | "api" | "custom" = "custom"
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

  getMetrics(type?: PerformanceMetric["type"]): PerformanceMetric[] {
    if (type) {
      return this.metrics.filter((m) => m.type === type);
    }
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name && m.duration);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + (m.duration || 0), 0);
    return sum / filtered.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  dispose() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = PerformanceMonitorService.getInstance();

