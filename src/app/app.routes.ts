import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ApiReferenceComponent } from './api-reference/api-reference.component';
import { AuthGuard } from './auth.guard';
import { DashboardRedirectGuard } from './dashboard-redirect.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PumpMonitoringComponent } from './pump-monitoring/pump-monitoring.component';
import { ReportsComponent } from './reports/reports.component';
import { RoleGuard } from './role.guard';
import { SettingsComponent } from './settings/settings.component';
import { SmartIrrigationComponent } from './smart-irrigation/smart-irrigation.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [DashboardRedirectGuard], component: LoginComponent },
  { 
    path: 'simple-dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'farmer' } 
  },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'farmer' } 
      },
      { 
        path: 'admin-dashboard', 
        component: AdminDashboardComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'admin' } 
      },
      { 
        path: 'notifications', 
        component: NotificationsComponent 
      },
      { 
        path: 'reports', 
        component: ReportsComponent 
      },
      { 
        path: 'settings', 
        component: SettingsComponent 
      },
      { 
        path: 'user', 
        component: UserComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'admin' } 
      },
      { 
        path: 'api-reference', 
        component: ApiReferenceComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'admin' } 
      },
      { 
        path: 'smart-irrigation', 
        component: SmartIrrigationComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'farmer' } 
      },
      { 
        path: 'pump-monitoring', 
        component: PumpMonitoringComponent 
      }
    ]
  }
];
