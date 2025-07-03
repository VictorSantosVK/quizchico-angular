import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';

  constructor(private http: HttpClient) {}

  // Login: envia email e senha para o backend
  login(dados: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dados);
  }

  // Registro: envia nome, email e senha para o backend
  register(dados: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dados);
  }
}
