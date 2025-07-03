import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  isLoginVisible: boolean = true;

  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  toggleView(showLogin: boolean): void {
    this.isLoginVisible = showLogin;
  }

  onLoginSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      alert('⚠️ Por favor, preencha todos os campos!');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        alert('✅ Login realizado com sucesso!');
        localStorage.setItem('userName', res.user.name);
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao fazer login');
      },
    });
  }

onRegisterSubmit(): void {
  if (
    !this.registerData.name ||
    !this.registerData.email ||
    !this.registerData.password ||
    !this.registerData.confirmPassword
  ) {
    alert('⚠️ Por favor, preencha todos os campos!');
    return;
  }

  if (this.registerData.password !== this.registerData.confirmPassword) {
    alert('⚠️ As senhas não coincidem!');
    return;
  }

  this.authService
    .register({
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password
    })
    .subscribe({
      next: () => {
        alert('✅ Registro realizado com sucesso!');
        this.toggleView(true);
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao se registrar');
      }
    });
}

}
