import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    // Simulando dados do usuário
    this.userName = localStorage.getItem('userName') || 'Usuário';
    
    // Simulando quizzes (substituir por chamada real ao backend)
   // No método ngOnInit() do componente Quizzes
this.quizzes = [
  {
    id: 'historia-brasil', 
    title: 'História do Brasil',
    description: 'Teste seus conhecimentos sobre a história do nosso país',
    category: 'História',
    questions: [1, 2, 3, 4, 5]
  },
  {
    id: 'matematica-basica', 
    title: 'Matemática Básica',
    description: 'Operações matemáticas fundamentais',
    category: 'Matemática',
    questions: [1, 2, 3]
  },
  {
    id: 'ciencias-naturais', 
    title: 'Ciências Naturais',
    description: 'Conhecimentos gerais sobre ciências',
    category: 'Ciências',
    questions: [1, 2, 3, 4]
  }
];

    // Simulando dados do perfil
    this.loadProfileData();
  }

  loadProfileData() {
    // Simulando dados do perfil (substituir por chamada real ao backend)
    this.averageScore = 75; // 75%
    this.quizzesCompleted = 8;
    this.quizHistory = [
      { title: 'História do Brasil', date: '2023-05-15', score: 80 },
      { title: 'Matemática Básica', date: '2023-05-10', score: 90 },
      { title: 'Ciências Naturais', date: '2023-05-05', score: 70 }
    ];
  }

  openProfileModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    // Redirecionar para login (implementar navegação)
    console.log('Usuário deslogado');
  }

  get filteredQuizzes() {
    return this.quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      quiz.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
}