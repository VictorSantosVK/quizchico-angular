import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true, // Se estiver usando standalone components
  imports: [FormsModule], // Adicione FormsModule aqui se for standalone
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None 
})

export class Login {
  isLoginVisible: boolean = true;
  
  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  toggleView(showLogin: boolean): void {
    this.isLoginVisible = showLogin;
  }

  onLoginSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      alert('⚠️ Por favor, preencha todos os campos!');
      return;
    }

    // Mock de login bem-sucedido
    if (this.loginData.email === 'admin@admin.com' && this.loginData.password === 'admin123') {
      alert('✅ Login de administrador realizado com sucesso!');
      localStorage.setItem('userName', 'Administrador');
      this.router.navigate(['/admin']);
    } else {
      alert('✅ Login realizado com sucesso! ');
      localStorage.setItem('userName', 'Usuário Teste');
      this.router.navigate(['/quizzes']);
    }
  }

  onRegisterSubmit(): void {
    if (!this.registerData.name || !this.registerData.email || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      alert('⚠️ Por favor, preencha todos os campos!');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('⚠️ As senhas não coincidem!');
      return;
    }

    if (this.registerData.password.length < 6) {
      alert('⚠️ A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // Mock de registro bem-sucedido
    alert('✅ Registro realizado com sucesso! Você já pode fazer login.');
    this.toggleView(true);
    this.registerData = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}