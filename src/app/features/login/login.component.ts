import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class LoginComponent {

  loginService: LoginService;
  nickUsuario: string = '';
  contrasena: string = '';

  constructor(private router: Router, loginService: LoginService) {
    this.loginService = loginService;
    // @TODO: Implementar el constructor

  }

  async login() {
    console.log("Login button clicked");
    let result = await this.loginService.iniciarSesion(this.nickUsuario, this.contrasena);
    if(result === true){
      console.log("Login successful");
      localStorage.setItem('nickUsuario', this.nickUsuario);
      localStorage.setItem('contrasena', this.contrasena);
      this.router.navigate(['/usuarios']);
    } else {
      console.log("Login failed");
      alert("Usuario o contraseña incorrectos"); 
    }
    console.log("Login result:", result);
  }

  // @TODO: Implementar métodos, atributos, etc. necesarios para el funcionamiento del login
}
