import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  healthStatus = '';
  loginResponse = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth(): void {
    this.loading = true;
    this.error = '';
    this.http.get(`${this.apiUrl}/health`).subscribe({
      next: (response) => {
        this.healthStatus = JSON.stringify(response, null, 2);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur santé API: ${err.status} ${err.statusText}`;
        this.loading = false;
      }
    });
  }

  testLogin(): void {
    this.loading = true;
    this.error = '';
    this.http.post(`${this.apiUrl}/auth/login`, {
      username: 'editor_user',
      password: 'password'
    }).subscribe({
      next: (response) => {
        this.loginResponse = JSON.stringify(response, null, 2);
        localStorage.setItem('auth_token', (response as any).token);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur login: ${err.status} ${err.statusText} - ${JSON.stringify(err.error)}`;
        this.loading = false;
      }
    });
  }

  checkToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loginResponse = `Token trouvé: ${token.substring(0, 50)}...`;
    } else {
      this.error = 'Aucun token trouvé';
    }
  }
}
