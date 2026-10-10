import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'EDITOR' | 'VERIFIER' | 'SENIOR_VERIFIER';

export interface ManagedUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface NewUser {
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(this.apiUrl);
  }

  createUser(user: NewUser): Observable<ManagedUser> {
    return this.http.post<ManagedUser>(this.apiUrl, user);
  }

  updateUser(id: number, changes: Partial<ManagedUser>): Observable<ManagedUser> {
    return this.http.put<ManagedUser>(`${this.apiUrl}/${id}`, changes);
  }
}
