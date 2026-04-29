import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';
import { WatsonService } from './services/watson.service';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('Cibertec Simulation');
  public authService = inject(AuthService);
  private watsonService = inject(WatsonService);
  public loadingService = inject(LoadingService);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.watsonService.loadChat();
    }
  }
}
