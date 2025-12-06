/**
 * Gestion de l'état du streaming
 * Responsabilité : Status et callbacks uniquement
 */

import type { LiveStreamCallbacks, LiveStreamStatus } from "./types";

export class StreamStateManager {
  private status: LiveStreamStatus = "disconnected";
  private callbacks: LiveStreamCallbacks = {};
  private isStarting = false;

  setCallbacks(callbacks: LiveStreamCallbacks): void {
    this.callbacks = callbacks;
  }

  updateStatus(status: LiveStreamStatus): void {
    this.status = status;
    this.callbacks.onStatusChange?.(status);
  }

  handleError(error: Error): void {
    console.error("❌ Streaming:", error);
    this.updateStatus("error");
    this.callbacks.onError?.(error);
  }

  setStarting(value: boolean): void {
    this.isStarting = value;
  }

  getStatus(): LiveStreamStatus {
    return this.status;
  }

  isStreaming(): boolean {
    return this.status === "streaming";
  }

  canStart(): boolean {
    return !this.isStarting;
  }

  getCallbacks(): LiveStreamCallbacks {
    return this.callbacks;
  }

  reset(): void {
    this.status = "disconnected";
    this.callbacks = {};
    this.isStarting = false;
  }
}
