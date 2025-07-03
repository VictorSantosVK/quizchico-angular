import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responder-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
    styleUrls: ['./responder-quiz.css'],
  templateUrl: './responder-quiz.html',
   encapsulation: ViewEncapsulation.None

})
export class ResponderQuiz implements OnInit {
  quizId: string = '';
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  userAnswers: number[] = [];
  score: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    this.questions = this.getMockedQuestions(this.quizId);
  }

  getMockedQuestions(quizId: string): any[] {
    const mockData: any = {
      'historia-brasil': [
        {
          text: 'Quem foi o primeiro presidente do Brasil?',
          options: ['Dom Pedro I', 'Deodoro da Fonseca', 'Getúlio Vargas', 'Juscelino Kubitschek'],
          correctAnswer: 1
        },
        {
          text: 'Em que ano ocorreu a Proclamação da República?',
          options: ['1889', '1822', '1500', '1964'],
          correctAnswer: 0
        }
      ],
      'matematica-basica': [
        {
          text: 'Quanto é 7 + 3?',
          options: ['9', '10', '11', '13'],
          correctAnswer: 1
        },
        {
          text: 'Qual o resultado de 6 × 7?',
          options: ['42', '36', '48', '40'],
          correctAnswer: 0
        }
      ],
      'ciencias-naturais': [
        {
          text: 'Qual planeta é conhecido como planeta vermelho?',
          options: ['Terra', 'Marte', 'Júpiter', 'Vênus'],
          correctAnswer: 1
        },
        {
          text: 'A água ferve a que temperatura?',
          options: ['90°C', '80°C', '100°C', '110°C'],
          correctAnswer: 2
        }
      ]
    };

    return mockData[quizId] || [];
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  selectAnswer(index: number) {
    this.userAnswers[this.currentQuestionIndex] = index;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateScore();
    }
  }

  calculateScore() {
    let correct = 0;
    this.questions.forEach((q, i) => {
      if (this.userAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    this.score = Math.round((correct / this.questions.length) * 100);
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.score = null;
  }

  getResultClass(): string {
    if (!this.score) return '';
    if (this.score >= 70) return 'excellent';
    if (this.score >= 40) return 'good';
    return 'poor';
  }

  getResultIcon(): string {
    if (!this.score) return 'fas fa-question';
    if (this.score >= 70) return 'fas fa-trophy';
    if (this.score >= 40) return 'fas fa-smile';
    return 'fas fa-frown';
  }

  getResultMessage(): string {
    if (!this.score) return '';
    if (this.score >= 70) return 'Excelente desempenho! Você domina este assunto.';
    if (this.score >= 40) return 'Bom trabalho! Com um pouco mais de estudo você melhora ainda mais.';
    return 'Continue praticando! Revise o conteúdo e tente novamente.';
  }
}