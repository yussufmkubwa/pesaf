import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardRedirectGuard } from './dashboard-redirect.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IrrigationComponent } from './irrigation/irrigation.component';
import { LoginComponent } from './login/login.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReportsComponent } from './reports/reports.component';
import { RoleGuard } from './role.guard';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [DashboardRedirectGuard], component: LoginComponent },
  {
    path: '',
    component: NavigationComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'farmer' } },
      { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'monitoring', component: MonitoringComponent },
      { path: 'irrigation', component: IrrigationComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'user', component: UserComponent, canActivate: [RoleGuard], data: { role: 'admin' } }
    ]
  }
];
