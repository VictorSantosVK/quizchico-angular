import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ranking.html',
  styleUrls: ['./ranking.css'],
 encapsulation: ViewEncapsulation.None
})
export class Ranking {
  userName: string = 'Usuário';
  userPosition: number = 5;
  userScore: number = 78;

  rankingData = [
    { id: 1, name: 'Jogador 1', averageScore: 95 },
    { id: 2, name: 'Jogador 2', averageScore: 88 },
    { id: 3, name: 'Jogador 2', averageScore: 85 },
    { id: 4, name: 'Jogador 4', averageScore: 80 },
    { id: 'current-user', name: 'VOCÊ', averageScore: 78 },
    { id: 6, name: 'Jogador 6', averageScore: 75 },
    { id: 7, name: 'Jogador 7', averageScore: 70 },
    { id: 8, name: 'Jogador 8', averageScore: 65 },
    { id: 9, name: 'Jogador 9', averageScore: 60 },
    { id: 10, name: 'Jogador 10', averageScore: 55 },
  ];

  ngOnInit() {
    // Simular dados do usuário do localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }
  }

  getMedalClass(position: number): string {
    const medals = {
      1: 'medal-gold',
      2: 'medal-silver',
      3: 'medal-bronze',
    };
    return medals[position as keyof typeof medals] || '';
  }

  logout() {
    // Simular logout
    localStorage.removeItem('userName');
    console.log('Usuário deslogado');
    // Redirecionar para login (implementar navegação)
  }
}
