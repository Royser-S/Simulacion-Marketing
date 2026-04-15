import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private simulationService = inject(SimulationService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  dateNow = new Date();
  escenarios = signal<any[]>([]);
  misSimulaciones = signal<any[]>([]);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const user = this.authService.getCurrentUser();
    
    // Cargar escenarios y luego mis simulaciones para cruzar datos
    this.simulationService.listarEscenarios().subscribe({
      next: (data) => {
        this.simulationService.listarSimulacionesPorUsuario(user.id).subscribe({
          next: (sims) => {
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
    if (escenario.estadoSim === 'EN_PROGRESO' || escenario.estadoSim === 'FINALIZADO') {
      this.router.navigate(['/simulation', escenario.simulacionId]);
      return;
    }

    const user = this.authService.getCurrentUser();
    this.simulationService.iniciarSimulacion(user.id, escenario.id).subscribe({
      next: (simId) => this.router.navigate(['/simulation', simId]),
      error: (err) => this.notify.error('Error al iniciar: ' + (err.error.message || 'Error'))
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
