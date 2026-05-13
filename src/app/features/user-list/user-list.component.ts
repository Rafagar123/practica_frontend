import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, UserPopupComponent, FormsModule]
})
export class UserListComponent implements OnInit {
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  userService: UserService;
  nickUsuario: string = '';
  contrasena: string = '';
  usuarios: any[] = [];
  direcciones: any[] = [];


  modoPopup: String = 'CLOSED';

  constructor(private router: Router, userService: UserService) {
    this.userService = userService;
  }

  async ngOnInit(): Promise<void> {

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';

    try {
      const response = await this.userService.obtenerUsuarios(nickUsuario, contrasena);

      console.log('Usuarios:', response);

      this.usuarios = response;
      await this.cargarDirecciones();
      await this.iconoGenero();


    } catch (error) {
      console.error('Error real:', error);
    }
  }


  async cargarDirecciones() {

    const nick = localStorage.getItem('nickUsuario') || '';
    const pass = localStorage.getItem('contrasena') || '';

    for (let usuario of this.usuarios) {
      let contador: number = 0;

      try {

        const direcciones = await this.userService.obtenerDireccionPrincipal(
          usuario.id,
          nick,
          pass
        );

        let direccionPrincipal = 'Sin dirección';

        for (let direccion of direcciones) {

          if (direccion.direccionPrincipal === true) {
            direccionPrincipal = direccion.nombreCalle;
          } else {
            contador += 1;
          }
        }

        usuario.direccionPrincipal = direccionPrincipal;
        usuario.direccionesExtra = contador;


      } catch (error) {

        console.error('Error obteniendo dirección:', error);

        usuario.direccionPrincipal = 'Error';
      }
    }
  }

  async obtenerDireccionPrincipal(usuarioId: number): Promise<String | null> {

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';
    let direccionPrincipal: string | null = null;

    try {
      const response = await this.userService.obtenerDireccionPrincipal(usuarioId, nickUsuario, contrasena);

      this.direcciones = response;

      for (let direccion of this.direcciones) {
        if (direccion.direccionPrincipal === true) {
          direccionPrincipal = direccion.nombreCalle;
          break;
        }
      }
      return direccionPrincipal;

    } catch (error) {
      console.error('Error real:', error);
      return null
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    return edad;
  }

  iconoGenero() {

    for (let usuario of this.usuarios) {

      if (usuario.genero.id == '1') {

        usuario.icono = 'assets/images/Male.JPG';

      } else if (usuario.genero.id == '2') {

        usuario.icono = 'assets/images/Female.JPG';

      } else {

        usuario.icono = 'assets/images/Other.png';
      }

    }
  }

  volverLogin(){
    this.router.navigate(['/login']);
  }

  onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
  }

  launchPopup() {

    this.modoPopup = 'LAUNCH';
  }

  // @TODO: Implementar propiedades, atributos, métodos... necesarios para el funcionamiento del listado de usuarios

}
