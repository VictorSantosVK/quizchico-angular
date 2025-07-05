import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface BaseQuestion {
  text: string;
  type: 'multiple' | 'boolean' | 'text';
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple';
  options: { text: string }[];
  correctOption: number;
}

interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
  correctAnswer: boolean;
}

interface TextQuestion extends BaseQuestion {
  type: 'text';
  correctAnswer: string;
}

type Question = MultipleChoiceQuestion | BooleanQuestion | TextQuestion;

interface Quiz {
  id: number;
  title: string;
  category: string;
  description: string;
  questions: Question[];
}

interface User {
  id: number;
  name: string;
  email: string;
  profile: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  encapsulation: ViewEncapsulation.None
})
export class Admin {
  activeSection: 'quizzes' | 'users' = 'quizzes';
  showModal = false;
  isEditing = false;
  currentQuizId: number | null = null;

  // Dados mockados
  quizzes: Quiz[] = [
    { 
      id: 1, 
      title: 'História do Brasil', 
      category: 'História', 
      description: 'Quiz sobre fatos históricos', 
      questions: [
        {
          type: 'multiple',
          text: 'Em que ano o Brasil foi descoberto?',
          options: [
            { text: '1492' },
            { text: '1500' },
            { text: '1502' },
            { text: '1498' }
          ],
          correctOption: 1
        },
        {
          type: 'boolean',
          text: 'A independência do Brasil foi proclamada em 1822',
          correctAnswer: true
        }
      ]
    },
    { 
      id: 2, 
      title: 'Matemática Básica', 
      category: 'Matemática', 
      description: 'Conceitos fundamentais', 
      questions: [
        {
          type: 'multiple',
          text: 'Quanto é 2 + 2?',
          options: [
            { text: '3' },
            { text: '4' },
            { text: '5' }
          ],
          correctOption: 1
        }
      ]
    },
    { 
      id: 3, 
      title: 'Ciências Naturais', 
      category: 'Ciências', 
      description: 'Conhecimentos gerais sobre ciências', 
      questions: [
        {
          type: 'text',
          text: 'Qual é a fórmula da água?',
          correctAnswer: 'H2O'
        },
        {
          type: 'boolean',
          text: 'A Terra é o terceiro planeta do sistema solar',
          correctAnswer: true
        }
      ]
    }
  ];

  users: User[] = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', profile: 'Admin' },
    { id: 2, name: 'Maria Souza', email: 'maria@email.com', profile: 'Usuário' },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', profile: 'Usuário' }
  ];

  newQuiz: Quiz = {
    id: 0,
    title: '',
    category: '',
    description: '',
    questions: []
  };

  // Métodos para alternar entre seções
  showQuizzesSection() {
    this.activeSection = 'quizzes';
  }

  showUsersSection() {
    this.activeSection = 'users';
  }

  // Métodos para o modal
  openAddQuizModal() {
    this.isEditing = false;
    this.newQuiz = {
      id: 0,
      title: '',
      category: '',
      description: '',
      questions: []
    };
    this.showModal = true;
  }

  openEditQuizModal(quiz: Quiz) {
    this.isEditing = true;
    this.currentQuizId = quiz.id;
    this.newQuiz = JSON.parse(JSON.stringify(quiz)); // Deep copy
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Métodos para gerenciar perguntas
  addNewQuestion() {
    const newQuestion: MultipleChoiceQuestion = {
      type: 'multiple',
      text: '',
      options: [
        { text: 'Opção 1' },
        { text: 'Opção 2' }
      ],
      correctOption: 0
    };
    this.newQuiz.questions.push(newQuestion);
  }

  removeQuestion(index: number) {
    this.newQuiz.questions.splice(index, 1);
  }

  addOption(questionIndex: number) {
    const question = this.newQuiz.questions[questionIndex];
    if (question.type === 'multiple') {
      question.options.push({ text: 'Nova opção' });
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const question = this.newQuiz.questions[questionIndex];
    if (question.type === 'multiple') {
      if (question.options.length > 1) {
        question.options.splice(optionIndex, 1);
        
        // Ajusta o índice da resposta correta se necessário
        if (question.correctOption >= optionIndex) {
          question.correctOption = question.correctOption > 0 ? question.correctOption - 1 : 0;
        }
      }
    }
  }

  // Adicione este método na classe Admin, antes do método submitQuiz()
onQuestionTypeChange(question: Question) {
  // Quando o tipo muda, reconfiguramos a pergunta conforme o novo tipo
  if (question.type === 'multiple') {
    // Garante que a pergunta tenha a estrutura correta para múltipla escolha
    if (!('options' in question)) {
      (question as MultipleChoiceQuestion).options = [
        { text: 'Opção 1' },
        { text: 'Opção 2' }
      ];
      (question as MultipleChoiceQuestion).correctOption = 0;
    }
  } else if (question.type === 'boolean') {
    // Garante que a pergunta tenha a estrutura correta para verdadeiro/falso
    if (!('correctAnswer' in question)) {
      (question as BooleanQuestion).correctAnswer = true;
    }
  } else if (question.type === 'text') {
    // Garante que a pergunta tenha a estrutura correta para resposta textual
    if (!('correctAnswer' in question)) {
      (question as TextQuestion).correctAnswer = '';
    }
  }
  
  // Remove propriedades que não são mais necessárias
  if (question.type !== 'multiple' && 'options' in question) {
    delete (question as any).options;
    delete (question as any).correctOption;
  }
  if (question.type !== 'boolean' && 'correctAnswer' in question && typeof question.correctAnswer === 'boolean') {
    (question as TextQuestion).correctAnswer = '';
  }
}

  // Operações CRUD
  submitQuiz() {
    if (this.isEditing && this.currentQuizId) {
      const index = this.quizzes.findIndex(q => q.id === this.currentQuizId);
      if (index !== -1) {
        this.quizzes[index] = { ...this.newQuiz };
      }
    } else {
      this.newQuiz.id = this.quizzes.length > 0 
        ? Math.max(...this.quizzes.map(q => q.id)) + 1 
        : 1;
      this.quizzes.push({ ...this.newQuiz });
    }
    this.closeModal();
  }

  deleteQuiz(id: number) {
    if (confirm('Tem certeza que deseja excluir este quiz?')) {
      this.quizzes = this.quizzes.filter(q => q.id !== id);
    }
  }

  logout() {
    // Implementar lógica de logout
    console.log('Usuário deslogado');
  }
ngOnInit() {
  const userData = localStorage.getItem('user');

  if (!userData) {
    alert('Você precisa estar logado como administrador.');
    this.redirectAway();
    return;
  }

  const parsedUser = JSON.parse(userData);

  if (parsedUser.role !== 'admin') {
    alert('Acesso restrito. Você não é administrador.');
    this.redirectAway();
  }
}

redirectAway() {
  window.location.href = '/'; // Redireciona para home, login ou onde quiser
}

  // Helper para type guarding
  isMultipleChoiceQuestion(question: Question): question is MultipleChoiceQuestion {
    return question.type === 'multiple';
  }
}