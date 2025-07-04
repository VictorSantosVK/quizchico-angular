import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface QuizApiResponse {
  total: number;
  pages: number;
  currentPage: number;
  quizzes: any[];
}

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './quizzes.html',
  styleUrls: ['./quizzes.css'],
  encapsulation: ViewEncapsulation.None
})
export class Quizzes {
  userName: string | null = null;
  quizzes: any[] = [];
  searchQuery: string = '';
  averageScore: number = 0;
  quizzesCompleted: number = 0;
  quizHistory: any[] = [];
  loadingQuizzes = false;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || 'Usuário';
    this.searchQuery = '';
    this.loadQuizzes();
    this.loadProfileData();
  }

  loadQuizzes() {
    this.loadingQuizzes = true;
    console.log('Iniciando carregamento dos quizzes...');
    
    this.http.get<QuizApiResponse>('http://localhost:3001/api/quizzes').subscribe({
      next: (res) => {
        this.quizzes = res.quizzes;
        this.loadingQuizzes = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erro ao buscar quizzes:', err);
        this.loadingQuizzes = false;
        this.cdr.detectChanges();
      }
    });
  }

loadProfileData() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<any>('http://localhost:3001/api/users/me/stats', { headers }).subscribe({
    next: (res) => {
      this.averageScore = res.averageScore;
      this.quizzesCompleted = res.quizzesCompleted;
      this.quizHistory = res.recentQuizzes.map((quiz: any) => ({
        title: quiz.title,
        date: quiz.completedAt,
        score: quiz.score
      }));
    },
    error: (err) => {
      console.error('Erro ao carregar dados do perfil:', err);
    }
  });
}


  openProfileModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    console.log('Usuário deslogado');
  }

  get filteredQuizzes() {
    const filtrados = this.quizzes.filter(quiz =>
      quiz.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      quiz.category?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    return filtrados;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
}
