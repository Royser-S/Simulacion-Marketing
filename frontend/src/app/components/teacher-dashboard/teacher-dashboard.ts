import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { NotificationService } from '../../services/notification.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

      <!-- TABS DE NAVEGACIÓN -->
      <div class="d-flex gap-3 mb-4 border-bottom pb-2">
        <button (click)="tabActual.set('SIMS')" [class.active-tab]="tabActual() === 'SIMS'" class="btn-tab">
          <i class="bi bi-activity me-2"></i> Monitoreo de Avance
        </button>
        @if (esAdmin()) {
          <button (click)="tabActual.set('USERS')" [class.active-tab]="tabActual() === 'USERS'" class="btn-tab">
            <i class="bi bi-person-gear me-2"></i> Gestión de Usuarios
          </button>
        }
      </div>

      <div class="row animate__animated animate__fadeIn">
        <div class="col-12">
          
          <!-- TAB: SIMULACIONES -->
          @if (tabActual() === 'SIMS') {
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
                            <div class="progress flex-grow-1" style="height: 6px; width: 80px; background-color: #eee;">
                              <div class="progress-bar bg-primary" 
                                   [style.width.%]="sim.estado === 'FINALIZADO' ? 100 : ((sim.decisiones?.length || 0) / 8 * 100)">
                              </div>
                            </div>
                            @if (sim.estado === 'FINALIZADO') {
                              <span class="badge bg-success-soft text-success rounded-pill px-2">Completado</span>
                            } @else {
                              <span class="badge bg-warning-soft text-warning rounded-pill px-2">Activo</span>
                            }
                          </div>
                        </td>
                        <td class="fw-bold text-ciber-blue">{{ formatScore(sim.puntajeTotal) }} / 20</td>
                        <td class="pe-4 text-end">
                          <button (click)="verDetalle(sim.id)" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                            <i class="bi bi-eye me-1"></i> Reporte
                          </button>
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="5" class="text-center py-5 text-muted">No hay actividad reciente.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- TAB: USUARIOS (Solo Admin) -->
          @if (tabActual() === 'USERS' && esAdmin()) {
            <div class="card premium-card border-0 shadow-sm overflow-hidden rounded-5 animate__animated animate__fadeIn">
              <div class="card-header bg-white p-4 border-0">
                <h5 class="mb-0 fw-bold text-dark">Cuentas Institucionales</h5>
              </div>
              <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="bg-light">
                    <tr class="text-muted small text-uppercase">
                      <th class="ps-4 py-3">Usuario</th>
                      <th class="py-3">Rol</th>
                      <th class="py-3">Estado</th>
                      <th class="py-3 pe-4 text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of todosLosUsuarios(); track user.id) {
                      <tr>
                        <td class="ps-4 py-3">
                          <div>
                            <div class="fw-bold text-dark">{{ user.nombreCompleto }}</div>
                            <div class="small text-muted">{{ user.correo }}</div>
                          </div>
                        </td>
                        <td><span class="badge bg-light text-dark border rounded-pill">{{ user.rol.nombre }}</span></td>
                        <td>
                          <span [class]="user.activo ? 'bg-success' : 'bg-danger'" class="badge rounded-circle p-1 me-1"></span>
                          <span class="small fw-bold">{{ user.activo ? 'Activo' : 'Deshabilitado' }}</span>
                        </td>
                        <td class="pe-4 text-end">
                          <button (click)="toggleEstado(user)" 
                                  [class]="user.activo ? 'btn-outline-danger' : 'btn-outline-success'" 
                                  class="btn btn-sm rounded-pill px-3 fw-bold">
                            {{ user.activo ? 'Deshabilitar' : 'Habilitar' }}
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

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

    .btn-tab { border: none; background: none; padding: 10px 20px; font-weight: bold; color: #666; transition: 0.3s; border-bottom: 3px solid transparent; }
    .btn-tab:hover { color: #002855; }
    .btn-tab.active-tab { color: #002855; border-bottom-color: #002855; }
  `
})
export class InstitutionalDashboard implements OnInit {
  private simulationService = inject(SimulationService);
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  todasLasSimulaciones = signal<any[]>([]);
  todosLosUsuarios = signal<any[]>([]);
  tabActual = signal<'SIMS' | 'USERS'>('SIMS');
  mostrarRegistro = signal(false);
  cargando = signal(false);
  
  esAdmin = signal(false);
  newUser = { nombreCompleto: '', correo: '', password: '', rolNombre: 'DOCENTE' };

  formatScore(score: number): number {
    if (!score) return 0;
    const scaled = (score / 23.5) * 20;
    return Math.min(parseFloat(scaled.toFixed(1)), 20.0);
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.esAdmin.set(user?.rolNombre === 'ADMIN');
    this.cargarSimulaciones();
    if (this.esAdmin()) {
      this.cargarUsuarios();
    }
  }

  cargarSimulaciones() {
    this.simulationService.listarTodasLasSimulaciones().subscribe({
      next: (data) => this.todasLasSimulaciones.set(data),
      error: () => this.notify.error('No se pudieron cargar las simulaciones')
    });
  }

  cargarUsuarios() {
    this.adminService.listarUsuarios().subscribe({
      next: (data) => this.todosLosUsuarios.set(data),
      error: () => this.notify.error('No se pudieron cargar los usuarios')
    });
  }

  toggleEstado(user: any) {
    const accion = user.activo ? 'deshabilitar' : 'habilitar';
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      text: `El usuario ${user.nombreCompleto} ya no podrá acceder al sistema.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#002855',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.toggleEstadoUsuario(user.id).subscribe({
          next: () => {
            this.notify.success(`Usuario ${accion}ado con éxito`);
            this.cargarUsuarios();
          },
          error: () => this.notify.error('Error al cambiar estado')
        });
      }
    });
  }

  toggleRegistro() {
    this.mostrarRegistro.update(v => !v);
  }

  registrarUsuario() {
    if (!this.newUser.correo.endsWith('@cibertec.edu.pe')) {
      this.notify.error('El correo debe terminar en @cibertec.edu.pe');
      return;
    }

    if (!this.newUser.nombreCompleto || !this.newUser.password) {
      this.notify.error('Por favor completa todos los campos.');
      return;
    }

    this.cargando.set(true);
    this.adminService.registrarUsuario(this.newUser).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Usuario registrado correctamente.', 'success');
        this.mostrarRegistro.set(false);
        this.cargando.set(false);
        this.cargarUsuarios();
        this.newUser = { nombreCompleto: '', correo: '', password: '', rolNombre: 'DOCENTE' };
      },
      error: (err) => {
        const msg = err.error?.message || 'Error del servidor. Verifica el correo.';
        this.notify.error(msg);
        this.cargando.set(false);
      }
    });
  }

  verDetalle(simId: number) {
    this.router.navigate(['/simulation', simId]);
  }
}
