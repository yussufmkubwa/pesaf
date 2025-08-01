import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './navbar/dashboard/dashboard';
import { Login } from './login/login';
import { Reports } from './navbar/reports/reports';
import { Monitoring } from './navbar/monitoring/monitoring';
import { Irrigation } from './navbar/irrigation/irrigation';
import { Settings } from './navbar/settings/settings';
import { Notifications } from './navbar/notifications/notifications';
import { Navbar } from './navbar/navbar';
import { UserComponent } from './navbar/user/user';

// Sanidi njia za programu
export const routes: Routes = [

   // Default route
  { path: '', component: Login },

  {
    path: 'navbar',
    component: Navbar,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'monitoring', component: Monitoring },
      { path: 'irrigation', component: Irrigation },
      { path: 'settings', component: Settings },
      { path: 'notifications', component: Notifications },
      { path: 'reports', component: Reports },
      { path: 'user', component: UserComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // default inside navbar
    ]
  },

  { path: '**', redirectTo: '/login' } // Wildcard route for unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
