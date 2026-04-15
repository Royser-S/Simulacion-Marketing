import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/simulaciones';

  listarEscenarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/escenarios`);
  }

  iniciarSimulacion(usuarioId: number, escenarioId: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/iniciar?usuarioId=${usuarioId}&escenarioId=${escenarioId}`, {});
  }

  obtenerPreguntas(escenarioId: number, simulacionId?: number): Observable<any[]> {
    const url = simulacionId 
      ? `${this.apiUrl}/preguntas/${escenarioId}?simulacionId=${simulacionId}`
      : `${this.apiUrl}/preguntas/${escenarioId}`;
    return this.http.get<any[]>(url);
  }

  enviarRespuesta(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/responder`, request);
  }

  obtenerResultado(simulacionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resultado/${simulacionId}`);
  }

  listarSimulacionesPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  listarTodasLasSimulaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }
}
