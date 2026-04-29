import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-global-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-reports.html',
  styleUrl: './global-reports.css'
})
export class GlobalReportsComponent implements OnInit {
  private simService = inject(SimulationService);

  loading = signal(true);
  stats = signal<any>({
    totalSimulaciones: 0,
    completadas: 0,
    promedioPuntos: 0,
    porEscenario: []
  });

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.simService.listarTodasLasSimulaciones().subscribe({
      next: (sims) => {
        const total = sims.length;
        const completadas = sims.filter(s => s.estado === 'FINALIZADO').length;
        const totalPuntos = sims.reduce((acc, s) => acc + (s.puntosTotales || 0), 0);
        
        // Agrupar por escenario
        const grupos: any = {};
        sims.forEach(s => {
          const nombre = s.escenario.titulo;
          if (!grupos[nombre]) {
            grupos[nombre] = { nombre, count: 0, puntos: 0 };
          }
          grupos[nombre].count++;
          grupos[nombre].puntos += (s.puntosTotales || 0);
        });

        const porEscenario = Object.values(grupos).map((g: any) => ({
          ...g,
          promedio: g.count > 0 ? (g.puntos / g.count).toFixed(1) : 0,
          porcentaje: total > 0 ? Math.round((g.count / total) * 100) : 0
        }));

        this.stats.set({
          totalSimulaciones: total,
          completadas,
          promedioPuntos: total > 0 ? (totalPuntos / total).toFixed(1) : 0,
          porEscenario
        });
        this.loading.set(false);
      }
    });
  }
}
