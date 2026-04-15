import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/admin';

  registrarUsuario(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, request);
  }

  // Futuras extensiones administrativas
  listarEscenarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/escenarios`);
  }

  eliminarEscenario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/escenarios/${id}`);
  }
}
