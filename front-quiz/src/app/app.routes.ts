import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Quizzes } from './components/quizzes/quizzes';
import { Ranking } from './components/ranking/ranking';
import { ResponderQuiz } from './components/responder-quiz/responder-quiz';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: Login }, // Rota vazia direciona para Login
  { path: 'quizzes', component: Quizzes }, // Página de quizzes após login
  { path: 'ranking', component: Ranking }, // Página de ranking
  { path: 'admin', component: Admin }, // Página de administração
   { path: 'quiz/:id', component: ResponderQuiz }, // Página de quiz de respostas
  { path: '**', redirectTo: '' } // Redireciona rotas não encontradas para login
];