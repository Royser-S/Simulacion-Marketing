import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private simulationService = inject(SimulationService);
  public authService = inject(AuthService);
  private router = inject(Router);
  public notify = inject(NotificationService);

  dateNow = new Date();
  escenarios = signal<any[]>([]);
  misSimulaciones = signal<any[]>([]);
  rolUsuario: string = '';

  formatScore(score: number): number {
    if (!score) return 0;
    // Normalización: 23.5 es el máximo actual de MarketMind
    const scaled = (score / 23.5) * 20;
    return Math.min(parseFloat(scaled.toFixed(1)), 20.0);
  }

  calcularTotalPuntos() {
    return this.misSimulaciones().reduce((acc, sim) => acc + this.formatScore(sim.puntajeTotal), 0).toFixed(1);
  }

  ngOnInit() {
    this.rolUsuario = this.authService.getCurrentUser()?.rolNombre || 'ESTUDIANTE';
    this.cargarDatos();
  }

  cargarDatos() {
    const user = this.authService.getCurrentUser();
    
    // Cargar escenarios y luego mis simulaciones para cruzar datos
    this.simulationService.listarEscenarios().subscribe({
      next: (data) => {
        this.simulationService.listarSimulacionesPorUsuario(user.id).subscribe({
          next: (sims) => {
            this.misSimulaciones.set(sims);
            const escenariosConStatus = data.map(esc => {
              const simActiva = sims.find(s => s.escenario.id === esc.id && s.estado === 'EN_PROGRESO');
              const simTerminada = sims.find(s => s.escenario.id === esc.id && s.estado === 'FINALIZADO');
              
              return {
                ...esc,
                simulacionId: simActiva?.id || simTerminada?.id,
                estadoSim: simActiva ? 'EN_PROGRESO' : (simTerminada ? 'FINALIZADO' : 'NUEVO')
              };
            });
            this.escenarios.set(escenariosConStatus);
          }
        });
      },
      error: (err) => {
        this.notify.error('Error al conectar con el servidor.');
      }
    });
  }

  startSimulation(escenario: any) {
    if (escenario.estadoSim === 'EN_PROGRESO') {
      this.router.navigate(['/simulation', escenario.simulacionId]);
      return;
    }

    const user = this.authService.getCurrentUser();
    this.simulationService.iniciarSimulacion(user.id, escenario.id).subscribe({
      next: (simId) => this.router.navigate(['/simulation', simId]),
      error: (err) => this.notify.error('Error al iniciar: ' + (err.error.message || 'Error'))
    });
  }

  verResultado(simId: number) {
    this.router.navigate(['/simulation', simId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
