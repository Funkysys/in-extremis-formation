export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

// This is a simple toast service that can be used directly or with a toast library
export class ToastService {
  static showToast(message: string, type: ToastType = 'info', options?: ToastOptions) {
    // Default implementation logs to console
    console.log(`[Toast - ${type}]: ${message}`);
    
    // If toast library is available in the window object, use it
    const toast = (window as any).toast;
    if (toast) {
      toast[type]?.(message, options);
    }
  }

  static success(message: string, options?: ToastOptions) {
    this.showToast(message, 'success', options);
  }

  static error(message: string, options?: ToastOptions) {
    this.showToast(message, 'error', options);
  }

  static info(message: string, options?: ToastOptions) {
    this.showToast(message, 'info', options);
  }

  static warning(message: string, options?: ToastOptions) {
    this.showToast(message, 'warning', options);
  }
}
