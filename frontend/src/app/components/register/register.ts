import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  user = { nombreCompleto: '', correo: '', password: '', rolNombre: 'ESTUDIANTE' };
  loading = false;

  onRegister() {
    this.loading = true;
    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Registro exitoso. ¡Bienvenido!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.notify.error(err.error.message || 'Error en el registro');
      }
    });
  }
}
