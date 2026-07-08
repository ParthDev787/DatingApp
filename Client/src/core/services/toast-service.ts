import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {
    this.createTotastContainer();
  };

  private createTotastContainer() {
    if(!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.classList.add('toast', 'toast-bottom', 'toast-end');
      container.id = 'toast-container';     
      document.body.appendChild(container);
    }
  }

  private createToastElement(message: string, alertClass: string , duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if(!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg', 'toast-item');
    toast.innerHTML = `
      <div>
        <span>${message}</span>
        <button class="btn btn-sm btn-ghost ml-2">X</button>
      </div>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });
    toastContainer.appendChild(toast); 

    setTimeout(() => {
      if(toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }   

}
