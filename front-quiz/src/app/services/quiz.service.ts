import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Quiz {
  id: string;          
  title: string;
  description: string;
  category: string;
  questions: any[];   
}

export interface QuizHistory {
  title: string;
  date: string;        
  score: number;
}

export interface ProfileStats {
  averageScore: number;
  quizzesCompleted: number;
  history: QuizHistory[];
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private api = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.api}/quizzes`);
  }
  getProfile(): Observable<ProfileStats> {
    return this.http.get<ProfileStats>(`${this.api}/users/profile`);
  }
}
