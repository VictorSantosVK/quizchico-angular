import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  quizId: number;
}

interface QuizDetails {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-responder-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  styleUrls: ['./responder-quiz.css'],
  templateUrl: './responder-quiz.html',
  encapsulation: ViewEncapsulation.None
})
export class ResponderQuiz implements OnInit {
  quizId: string = '';
  quizTitle: string = '';
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  userAnswers: number[] = [];
  score: number | null = null;
  loading: boolean = true;
  error: string | null = null;
  showExplanations: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // <--- INJEÇÃO AQUI
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    this.loadQuizData();
  }

  async loadQuizData() {
    try {
      this.loading = true;
      this.error = null;

      const [quiz, questions] = await Promise.all([
        firstValueFrom(this.http.get<QuizDetails>(`http://localhost:3001/api/quizzes/${this.quizId}`)),
        firstValueFrom(this.http.get<Question[]>(`http://localhost:3001/api/questions/${this.quizId}`))
      ]);

      if (!quiz || !questions) {
        throw new Error('Dados do quiz não encontrados');
      }

      this.quizTitle = quiz.title;
      this.questions = questions.map(q => ({
        ...q,
        options: q.options || []
      }));
    } catch (err: any) {
      console.error('Erro ao carregar quiz:', err);
      this.error = err.message || 'Erro ao carregar o quiz';

      if (err?.status === 404) {
        setTimeout(() => this.router.navigate(['/quizzes']), 3000);
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // <--- FORÇA ATUALIZAÇÃO DA UI
    }
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  selectAnswer(index: number) {
    this.userAnswers[this.currentQuestionIndex] = index;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateScore();
      this.saveQuizResult();
    }
  }

calculateScore() {
  const correct = this.questions.reduce((acc, q, i) => {
    const userAnswerIndex = this.userAnswers[i];

    if (
      userAnswerIndex === undefined ||
      userAnswerIndex < 0 ||
      userAnswerIndex >= q.options.length
    ) {
      return acc; // resposta inválida ou não respondida
    }

    const selectedOption = q.options[userAnswerIndex];
    const correctOption = q.correctOption;

    // Força ambos para string pra garantir a comparação
    return acc + (String(selectedOption) === String(correctOption) ? 1 : 0);
  }, 0);

  this.score = Math.round((correct / this.questions.length) * 100);
}

  async saveQuizResult() {
    const token = localStorage.getItem('token');
    if (!token || this.score === null) return;

    try {
      await firstValueFrom(
        this.http.post('http://localhost:3001/api/user-quiz', {
          quizId: this.quizId,
          score: this.score
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.score = null;
    this.showExplanations = false;
  }

  getResultClass(): string {
    if (this.score === null) return '';
    if (this.score >= 70) return 'excellent';
    if (this.score >= 40) return 'good';
    return 'poor';
  }

  getResultIcon(): string {
    if (this.score === null) return 'fas fa-question';
    if (this.score >= 70) return 'fas fa-trophy';
    if (this.score >= 40) return 'fas fa-smile';
    return 'fas fa-frown';
  }

  getResultMessage(): string {
    if (this.score === null) return '';
    if (this.score >= 70) return 'Excelente desempenho!';
    if (this.score >= 40) return 'Bom trabalho!';
    return 'Continue praticando!';
  }

  toggleExplanations() {
    this.showExplanations = !this.showExplanations;
  }
}
