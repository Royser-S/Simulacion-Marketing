import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = signal(false);
  public loading = this._loading.asReadonly();

  show() {
    this._loading.set(true);
  }

  hide() {
    // Pequeño delay para evitar parpadeos en respuestas ultra rápidas
    setTimeout(() => {
      this._loading.set(false);
    }, 400);
  }
}
