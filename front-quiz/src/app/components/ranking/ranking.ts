import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

interface PlayerRanking {
  id: string | number;
  name: string;
  averageScore: number;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
<div class="container">
  <header class="d-flex flex-wrap justify-content-between align-items-center py-3 mb-4 border-bottom">
    <a routerLink="/quizzes" class="d-flex align-items-center mb-2 mb-md-0 text-dark text-decoration-none">
      <i class="bi bi-lightning-charge-fill fs-3 me-2 text-purple"></i>
      <span class="fs-4 fw-bold text-purple">Quiz Chico</span>
    </a>

    <ul class="nav nav-pills">
      <li class="nav-item"><a routerLink="/quizzes" class="nav-link">Início</a></li>
      <li class="nav-item"><a routerLink="/ranking" class="nav-link active bg-purple">Ranking</a></li>
    </ul>

    <div class="dropdown">
      <button class="btn btn-outline-purple dropdown-toggle d-flex align-items-center" type="button"
              id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-2"></i>
        <span>{{ userName }}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <li><a class="dropdown-item" routerLink="/profile"><i class="bi bi-person me-2"></i>Perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" (click)="logout($event)"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
      </ul>
    </div>
  </header>

  <main class="my-5">
    <div class="ranking-container">
      <div class="ranking-header">
        <h1 class="page-title"><i class="bi bi-trophy-fill"></i> Ranking de Pontuações</h1>
        <p class="text-muted">Veja como você está em relação aos outros jogadores</p>
      </div>

      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-purple" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando ranking...</p>
      </div>

      <div *ngIf="error" class="text-center py-5 text-danger">
        <i class="bi bi-exclamation-triangle-fill fs-1"></i>
        <h5 class="mt-3">Ops, algo deu errado!</h5>
        <p class="text-muted">{{ errorMessage }}</p>
        <button class="btn btn-sm btn-outline-purple mt-2" (click)="loadRanking()">
          <i class="bi bi-arrow-repeat"></i> Tentar novamente
        </button>
      </div>

      <div *ngIf="!loading && !error && rankingData.length === 0" class="text-center py-5">
        <i class="bi bi-emoji-frown fs-1 text-muted"></i>
        <h5 class="mt-3">Nenhum dado disponível</h5>
        <p class="text-muted">Seja o primeiro a completar um quiz!</p>
        <a routerLink="/quizzes" class="btn btn-sm btn-purple mt-2">Tentar agora</a>
      </div>

      <div *ngIf="!loading && !error && rankingData.length > 0">
        <div class="d-flex justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <span class="position-user badge bg-purple me-2">Sua Posição</span>
            <span [ngClass]="{'text-purple': userPosition <= 3}">#{{ userPosition }}</span>
          </div>
          <div class="d-flex align-items-center">
            <span class="position-user badge bg-purple me-2">Sua Pontuação</span>
            <span [ngClass]="{
              'text-success': userScore >= 70,
              'text-warning': userScore >= 50 && userScore < 70,
              'text-danger': userScore < 50
            }">{{ userScore }}%</span>
          </div>
        </div>

        <ul class="ranking-list">
          <li *ngFor="let user of rankingData; let i = index" 
              class="ranking-item"
              [class.user-you]="user.id === currentUserId"
              [style.animationDelay]="(i + 1) * 0.05 + 's'">
            <div class="position" [ngClass]="getMedalClass(i + 1)">
              {{ i + 1 }}
              <i *ngIf="i < 3" class="bi bi-award-fill"></i>
            </div>
            <div class="user-info">
              {{ user.id === currentUserId ? 'VOCÊ' : user.name || 'Usuário Anônimo' }}
              <span *ngIf="user.id === currentUserId" class="badge bg-light text-purple ms-2">Você</span>
            </div>
            <div class="user-score">
              {{ user.averageScore | number: '1.0-0' }}%
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</div>
  `,
  styleUrls: ['./ranking.css'],
  encapsulation: ViewEncapsulation.None
})
export class Ranking implements OnInit {
  userName: string = 'Usuário';
  currentUserId: string | null = null;
  userPosition: number = 0;
  userScore: number = 0;
  rankingData: PlayerRanking[] = [];

  loading = false;
  error = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.currentUserId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName') || 'Usuário';

    if (!token || !this.currentUserId) {
      this.error = true;
      this.errorMessage = 'Você precisa estar logado para ver o ranking.';
      // opcional: redirecionar para login aqui com Router
      return;
    }

    this.loadRanking();
  }

  loadRanking() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = true;
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<{data: PlayerRanking[]}>('http://localhost:3001/api/ranking', { headers, observe: 'body' })
      .pipe(
        timeout(10000),
        catchError(err => {
          this.error = true;
          if (err.name === 'TimeoutError') {
            this.errorMessage = 'O servidor demorou muito para responder.';
          } else if (err.status === 401) {
            this.errorMessage = 'Não autorizado. Faça login novamente.';
            // opcional: limpar token e redirecionar para login
          } else {
            this.errorMessage = err.message || 'Erro ao carregar ranking.';
          }
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (!response || !Array.isArray(response.data)) {
          this.error = true;
          this.errorMessage = 'Formato de dados inválido.';
          return;
        }

        this.rankingData = response.data;

        const userIndex = this.rankingData.findIndex(u => u.id == this.currentUserId);
        if (userIndex !== -1) {
          this.userPosition = userIndex + 1;
          this.userScore = this.rankingData[userIndex].averageScore;
        } else {
          this.userPosition = 0;
          this.userScore = 0;
        }
      });
  }

  getMedalClass(position: number): string {
    const medals: Record<number, string> = {
      1: 'medal-gold',
      2: 'medal-silver',
      3: 'medal-bronze',
    };
    return medals[position] || '';
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    // redirecionar para login (exemplo, usando Router)
    window.location.href = '/'; // ou router.navigate(['/login']);
  }
}
