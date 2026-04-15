import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { SimulationComponent } from './components/simulation/simulation';
import { InstitutionalDashboard } from './components/teacher-dashboard/teacher-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'simulation/:id', component: SimulationComponent, canActivate: [authGuard] },
  { path: 'institutional-dashboard', component: InstitutionalDashboard, canActivate: [authGuard] },
  { path: 'teacher-dashboard', redirectTo: 'institutional-dashboard' }
];
