import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#0d47a1',
      timer: 3000
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#0d47a1'
    });
  }

  info(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: message,
      confirmButtonColor: '#0d47a1',
      timer: 3000
    });
  }

  warning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: message,
      confirmButtonColor: '#0d47a1'
    });
  }

  loading(message: string = 'Cargando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}
