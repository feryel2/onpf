import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FilesComponent } from './pages/files/files.component';
import { FileDetailsComponent } from './pages/file-details/file-details.component';
import { StudyComponent } from './pages/study/study.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { FinalVerificationComponent } from './pages/final-verification/final-verification.component';
import { OperationsLogComponent } from './pages/operations-log/operations-log.component';
import { SearchComponent } from './pages/search/search.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DebugComponent } from './pages/debug/debug.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: 'debug',
    component: DebugComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'files',
        component: FilesComponent
      },
      {
        path: 'files/:id',
        component: FileDetailsComponent
      },
      {
        path: 'study/:id',
        component: StudyComponent,
        canActivate: [RoleGuard],
        data: { roles: ['EDITOR'] }
      },
      {
        path: 'verification/:id',
        component: VerificationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['VERIFIER'] }
      },
      {
        path: 'final-verification/:id',
        component: FinalVerificationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SENIOR_VERIFIER'] }
      },
      {
        path: 'operations-log',
        component: OperationsLogComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SENIOR_VERIFIER'] }
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
