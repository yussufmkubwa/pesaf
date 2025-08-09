import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { IrrigationComponent } from './irrigation/irrigation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
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
      { path: 'user', component: UserComponent }
    ]
  }
];
