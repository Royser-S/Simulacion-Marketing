import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WatsonService } from '../../services/watson.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private watsonService = inject(WatsonService);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Estás seguro de que deseas salir del simulador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#002855',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    });

    if (result.isConfirmed) {
      this.authService.logout();
      this.watsonService.destroyChat();
      this.router.navigate(['/login']);
    }
  }
}
