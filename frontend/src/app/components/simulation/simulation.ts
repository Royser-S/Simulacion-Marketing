import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simulation.html'
})
export class SimulationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  private simulationService = inject(SimulationService);
  private notify = inject(NotificationService);
  
  simulacionId = signal<number | null>(null);
  preguntas = signal<any[]>([]);
  currentQuestionIndex = signal(0);
  mostrarResultado = signal(false);
  resultado = signal<any>(null);
  cargandoRespuesta = signal<boolean>(false);
  puntajeAcumulado = signal(0);
  isReadOnly = signal(false);
  
  viewMode = computed(() => {
    if (this.mostrarResultado()) return 'FINAL_RESULT';
    if (this.preguntas().length === 0) return 'LOADING';
    return 'SIMULATION';
  });

  maxPuntaje = computed(() => {
    let total = 0;
    this.preguntas().forEach(p => {
      const best = Math.max(...p.opciones.map((o: any) => o.puntos || 0));
      total += best;
    });
    return total || 20;
  });

  puntajeDisplay = computed(() => {
    const total = this.resultado()?.puntajeTotal || this.puntajeAcumulado();
    const max = this.maxPuntaje();
    const scaled = (total / max) * 20;
    const finalScore = parseFloat(scaled.toFixed(1));
    return Math.min(finalScore, 20.0);
  });

  ngOnInit() {
    const sId = Number(this.route.snapshot.paramMap.get('id'));
    this.simulacionId.set(sId);
    
    this.simulationService.obtenerResultado(sId).subscribe({
      next: (res) => {
        const escenarioId = res.escenarioId || 1;
        this.simulationService.obtenerPreguntas(escenarioId, sId).subscribe({
          next: (preguntas) => {
            this.preguntas.set(preguntas);
            this.processExistingProgress(res);
          }
        });
      },
      error: (err) => console.error('Error al recuperar estado', err)
    });
  }

  private processExistingProgress(res: any) {
    if (!res || !res.decisiones) return;
    this.resultado.set(res);
    this.puntajeAcumulado.set(res.puntajeTotal);
    
    // El índice actual es el número de decisiones ya tomadas
    this.currentQuestionIndex.set(res.decisiones.length);

    // Si el usuario es ADMIN o DOCENTE, queremos ver el reporte directamente
    const user = this.authService.getCurrentUser();
    const isAdminView = user && (user.rolNombre === 'DOCENTE' || user.rolNombre === 'ADMIN');

    if (res.decisiones.length >= 8 || isAdminView) {
      this.mostrarResultado.set(true);
      this.isReadOnly.set(true);
    }
    
    if (isAdminView) {
      this.isReadOnly.set(true);
    }
  }

  submitAnswer(opcionId: number) {
    if (this.isReadOnly() || this.cargandoRespuesta()) return;

    this.cargandoRespuesta.set(true);
    const q = this.preguntas()[this.currentQuestionIndex()];
    
    const request = {
      simulacionId: this.simulacionId(),
      preguntaId: q.id,
      opcionId: opcionId
    };

    this.simulationService.enviarRespuesta(request).subscribe({
      next: (feedback) => {
        this.puntajeAcumulado.update(p => p + feedback.puntosObtenidos);
        this.cargandoRespuesta.set(false);
        
        // Avanzar al siguiente índice
        const nextIdx = this.currentQuestionIndex() + 1;
        this.currentQuestionIndex.set(nextIdx);

        if (nextIdx >= 8) {
          this.finishSimulation();
        }
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Error al enviar respuesta');
        this.cargandoRespuesta.set(false);
      }
    });
  }

  finishSimulation() {
    this.simulationService.obtenerResultado(this.simulacionId()!).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.mostrarResultado.set(true);
      }
    });
  }

  printReport() {
    window.print();
  }

  downloadCertificate() {
    const element = document.getElementById('certificate-card');
    if (!element) return;
    this.notify.info('Generando reporte estratégico...');
    html2canvas(element, { backgroundColor: '#ffffff', scale: 2, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Reporte_Estrategico_${this.simulacionId()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.notify.success('¡Reporte guardado!');
    });
  }
}
