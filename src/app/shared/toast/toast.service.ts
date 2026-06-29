import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.idCounter++;
    const toast: ToastMessage = { message, type, id };
    
    this.toasts.update(t => [...t, toast]);
    
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
