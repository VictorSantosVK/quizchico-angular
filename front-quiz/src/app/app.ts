import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'meu-primeiro-app';


isAdmin(): boolean {
  const user = JSON.parse(localStorage.getItem('user')!);
  return user?.role === 'admin';
}


}


