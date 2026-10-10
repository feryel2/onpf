import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout Components
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

// Pages
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
import { LoginComponent } from './pages/login/login.component';
import { DebugComponent } from './pages/debug/debug.component';

// Services
import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    FilesComponent,
    FileDetailsComponent,
    StudyComponent,
    VerificationComponent,
    FinalVerificationComponent,
    OperationsLogComponent,
    SearchComponent,
    UsersComponent,
    SettingsComponent,
    LoginComponent,
    DebugComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    FileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
