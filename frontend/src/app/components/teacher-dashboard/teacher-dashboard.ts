import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { NotificationService } from '../../services/notification.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-institutional-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5 animate-fade-in pb-5">
      <div class="row mb-5">
        <div class="col-md-8">
          <h1 class="display-6 text-ciber-blue fw-bold mb-2">
            <i class="bi bi-shield-lock me-2"></i> Gestión Institucional
          </h1>
          <p class="text-muted lead">Control global de usuarios y monitoreo de desempeño en el CiberMarketing Lab.</p>
        </div>
        @if (esAdmin()) {
          <div class="col-md-4 text-md-end d-flex align-items-center justify-content-md-end">
            <button class="btn btn-ciber-blue rounded-pill px-4 py-2 shadow-sm" (click)="toggleRegistro()">
              <i class="bi" [class.bi-plus-lg]="!mostrarRegistro()" [class.bi-x-lg]="mostrarRegistro()"></i>
              {{ mostrarRegistro() ? 'Cerrar Registro' : 'Registrar Usuario' }}
            </button>
          </div>
        }
      </div>

      <!-- SECCIÓN REGISTRO (Solo Admin) -->
      @if (esAdmin() && mostrarRegistro()) {
        <div class="card border-0 shadow-lg rounded-5 mb-5 overflow-hidden animate__animated animate__fadeInDown">
          <div class="bg-ciber-blue p-4 text-white">
            <h4 class="mb-0 fw-bold">Nuevo Perfil Institucional</h4>
          </div>
          <div class="card-body p-5">
            <form (submit)="registrarUsuario()" class="row g-4">
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted text-uppercase">Nombre Completo</label>
                <input type="text" [(ngModel)]="newUser.nombreCompleto" name="nombre" class="form-control rounded-pill py-2" placeholder="Ej: Juan Pérez" required>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted text-uppercase">Correo Institucional</label>
                <input type="email" [(ngModel)]="newUser.correo" name="email" class="form-control rounded-pill py-2" placeholder="usuario@cibertec.edu.pe" required>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted text-uppercase">Contraseña Temporal</label>
                <input type="password" [(ngModel)]="newUser.password" name="pass" class="form-control rounded-pill py-2" required>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted text-uppercase">Rol Asignado</label>
                <select [(ngModel)]="newUser.rolNombre" name="rol" class="form-select rounded-pill py-2" required>
                  <option value="DOCENTE">DOCENTE (Monitoreo)</option>
                  <option value="ESTUDIANTE">ESTUDIANTE (Laboratorio)</option>
                  <option value="ADMIN">ADMINISTRADOR (Control Total)</option>
                </select>
              </div>
              <div class="col-md-12 text-end mt-4">
                <button type="submit" [disabled]="cargando()" class="btn btn-primary rounded-pill px-5 py-2 fw-bold">
                  {{ cargando() ? 'Procesando...' : 'Crear Cuenta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="row">
        <div class="col-12">
          <div class="card premium-card border-0 shadow-sm overflow-hidden rounded-5">
            <div class="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold text-dark">Simulaciones Activas / Finalizadas</h5>
              <span class="badge bg-soft-primary text-primary rounded-pill px-3">{{ todasLasSimulaciones().length }} totales</span>
            </div>
            <div class="table-responsive">
              <table class="table table-hover mb-0 align-middle">
                <thead class="bg-light">
                  <tr class="text-muted small text-uppercase">
                    <th class="ps-4 py-3">Estudiante</th>
                    <th class="py-3">Correo</th>
                    <th class="py-3">Fase / Progreso</th>
                    <th class="py-3">Desempeño</th>
                    <th class="py-3 pe-4 text-end">Análisis</th>
                  </tr>
                </thead>
                <tbody>
                  @for (sim of todasLasSimulaciones(); track sim.id) {
                    <tr class="transition-all">
                      <td class="ps-4 py-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="avatar-circle">{{ sim.usuario.nombreCompleto.charAt(0) }}</div>
                          <span class="fw-bold">{{ sim.usuario.nombreCompleto }}</span>
                        </div>
                      </td>
                      <td>{{ sim.usuario.correo }}</td>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <div class="progress flex-grow-1" style="height: 6px; width: 80px;">
                            <div class="progress-bar" [style.width.%]="(sim.decisiones?.length / 8) * 100"></div>
                          </div>
                          @if (sim.estado === 'FINALIZADO') {
                            <span class="badge bg-success-soft text-success rounded-pill px-2">Completado</span>
                          } @else {
                            <span class="badge bg-warning-soft text-warning rounded-pill px-2">Activo</span>
                          }
                        </div>
                      </td>
                      <td class="fw-bold text-ciber-blue">{{ sim.puntajeTotal | number:'1.1-1' }} / 20</td>
                      <td class="pe-4 text-end">
                        <button (click)="verDetalle(sim.id)" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                          <i class="bi bi-eye me-1"></i> Reporte
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="text-center py-5">No se encontraron simulaciones iniciadas.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .bg-ciber-blue { background-color: #002855; }
    .btn-ciber-blue { background-color: #002855; color: white; }
    .text-ciber-blue { color: #002855; }
    .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
    .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
    .bg-soft-primary { background-color: #f0f7ff; color: #002855; }
    .avatar-circle { width: 35px; height: 35px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666; font-size: 0.8rem; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `
})
export class InstitutionalDashboard implements OnInit {
  private simulationService = inject(SimulationService);
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  todasLasSimulaciones = signal<any[]>([]);
  mostrarRegistro = signal(false);
  cargando = signal(false);
  
  esAdmin = signal(false);
  newUser = { nombreCompleto: '', correo: '', password: '', rolNombre: 'DOCENTE' };

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.esAdmin.set(user?.rolNombre === 'ADMIN');
    this.cargarSimulaciones();
  }

  cargarSimulaciones() {
    this.simulationService.listarTodasLasSimulaciones().subscribe({
      next: (data) => this.todasLasSimulaciones.set(data),
      error: () => this.notify.error('No se pudieron cargar las simulaciones')
    });
  }

  toggleRegistro() {
    this.mostrarRegistro.update(v => !v);
  }

  registrarUsuario() {
    this.cargando.set(true);
    this.adminService.registrarUsuario(this.newUser).subscribe({
      next: () => {
        this.notify.success('Usuario registrado con éxito');
        this.mostrarRegistro.set(false);
        this.cargando.set(false);
        this.newUser = { nombreCompleto: '', correo: '', password: '', rolNombre: 'DOCENTE' };
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Error al registrar usuario');
        this.cargando.set(false);
      }
    });
  }

  verDetalle(simId: number) {
    this.router.navigate(['/simulation', simId]);
  }
}
