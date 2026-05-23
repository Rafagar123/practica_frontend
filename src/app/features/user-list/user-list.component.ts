import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';
import { Usuario, usuarioInicial } from 'src/app/core/models/user.model';
import { Direccion } from 'src/app/core/models/direccion.model';

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
  usuarios: Usuario[] = [];
  direcciones: Direccion[] = [];


  modoPopup: 'create' | 'edit' | 'CLOSED' = 'CLOSED';
  anteriorModoPopup: 'create' | 'edit' | 'CLOSED' = 'CLOSED';
  popupUser: Usuario | null = null;
  usuarioSeleccionado: Usuario | null = null;



  constructor(private router: Router, userService: UserService) {
    this.userService = userService;
  }

  async ngOnInit(): Promise<void> {

    this.nickUsuario = localStorage.getItem('nickUsuario') || '';
    this.contrasena = localStorage.getItem('contrasena') || '';

    try {
      const response = await this.userService.obtenerUsuarios(
        this.nickUsuario,
        this.contrasena
      );

      this.usuarios = response || [];

      this.usuarioSeleccionado = this.usuarios[0];
      await this.cargarDirecciones();
      this.iconoGenero();

    } catch (error) {
      console.error('Error real:', error);
    }
  }


  async cargarDirecciones() {

    const nick = localStorage.getItem('nickUsuario') || '';
    const pass = localStorage.getItem('contrasena') || '';

    for (let usuario of this.usuarios) {
      if (usuario.id == null) {
        continue;
      }

      let contador: number = 0;

      try {

        const direcciones = await this.userService.obtenerDirecciones(
          usuario.id,
          nick,
          pass
        );

        let direccionPrincipalObj = null;

        for (let direccion of direcciones) {

          if (direccion.direccionPrincipal === true) {

            direccionPrincipalObj = {
              nombreCalle: direccion.nombreCalle,
              numeroCalle: direccion.numeroCalle
            };

          } else {
            contador += 1;
          }
        }

        usuario.direccionPrincipal = direccionPrincipalObj || {
          nombreCalle: 'Sin dirección',
          numeroCalle: ''
        };

        usuario.direccionesExtra = contador;

      } catch (error) {

        console.error('Error obteniendo dirección:', error);

        usuario.direccionPrincipal = {
          nombreCalle: 'Error',
          numeroCalle: ''
        };
      }
    }
  }

  async obtenerDireccionPrincipal(usuarioId: number): Promise<string | null> {

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';
    let direccionPrincipal: string | null = null;

    try {
      const response = await this.userService.obtenerDirecciones(usuarioId, nickUsuario, contrasena);

      this.direcciones = response || [];

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

  calcularEdad(fechaNacimiento: string | null): number {
    const hoy = new Date();
    const nacimiento = fechaNacimiento ? new Date(fechaNacimiento) : hoy;

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    return edad;
  }

  iconoGenero() {
    for (let usuario of this.usuarios) {
      const gid = usuario.genero?.id;
      if (gid === 1) {
        usuario.icono = 'assets/images/Male.JPG';
      } else if (gid === 2) {
        usuario.icono = 'assets/images/Female.JPG';
      } else {
        usuario.icono = 'assets/images/Other.png';
      }
    }
  }



  onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
  }

  launchPopup() {
    this.openCreatePopup();
  }

  openCreatePopup() {
    this.modoPopup = 'create';
    this.popupUser = JSON.parse(JSON.stringify(usuarioInicial));
    this.anteriorModoPopup = 'create';
  }

  openEditPopup(usuario: Usuario) {
    this.modoPopup = 'edit';
    this.popupUser = JSON.parse(JSON.stringify(usuario));
    this.anteriorModoPopup = 'edit';
  }

  openEditPopupSelected() {
    if (!this.usuarioSeleccionado) {
      return;
    }
    this.openEditPopup(this.usuarioSeleccionado);
  }

  async onUserSave(data: any) {
    const usuario = data.usuario;
    const direcciones = data.direcciones;
    const idBorrar = data.idBorrar;
    const direccionCreadaEnEditar = data.direccionCreadaEnEditar;

    if (this.anteriorModoPopup === 'create') {
      const usuarioCreado = await this.crearUsuario(usuario);
      if (usuarioCreado.id != null) {
        await this.crearDireccion(
          direccionCreadaEnEditar,
          usuarioCreado.id
        );
      }
    } else if (this.anteriorModoPopup === 'edit'){
      await this.editarUsuario(usuario);
      await this.guardarDirecciones(direcciones);
      await this.eliminarDireccion(idBorrar);
      await this.crearDireccion(direccionCreadaEnEditar, usuario.id);
    }
    this.modoPopup = 'CLOSED';
    await this.ngOnInit();
  }

  async crearUsuario(usuario: Usuario): Promise<Usuario> {
    console.log('Crear usuario:', usuario);

    const usuarioCreado = await this.userService.crearUsuario(usuario, this.nickUsuario, this.contrasena);
    return usuarioCreado;
  }


  async editarUsuario(usuario: Usuario) {
    console.log('Modificar usuario:', usuario);
    await this.userService.editarUsuario(usuario, this.nickUsuario, this.contrasena);
  }

  async eliminarUsuario() {

    var resultado = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    
    if (!this.usuarioSeleccionado?.id || !resultado) {
      return;
    }

    await this.userService.eliminarUsuario(
      this.usuarioSeleccionado.id,
      this.nickUsuario,
      this.contrasena
    );
    await this.ngOnInit();
  }

  async guardarDirecciones(direcciones: Direccion[]) {

    for (let direccion of direcciones) {

      await this.userService.editarDireccion(
        direccion,
        this.nickUsuario,
        this.contrasena
      );
    }
  }

  async eliminarDireccion(idBorrar: number) {

    if (idBorrar === null) {
      return;
    }
    await this.userService.eliminarDireccion(
      idBorrar,
      this.nickUsuario,
      this.contrasena
    );
    await this.ngOnInit();
  }

  async crearDireccion(direccionCreadaEnEditar: Direccion | null, usuarioId: number) {
    console.log('Direccion recibida:', direccionCreadaEnEditar);
    console.log('Usuario ID:', usuarioId);

    if (direccionCreadaEnEditar === null) {
      return;
    }

    if (this.anteriorModoPopup === 'edit' && usuarioId) {
      await this.userService.crearDireccion(
        direccionCreadaEnEditar,
        this.nickUsuario,
        this.contrasena
      );
    }

    if (this.anteriorModoPopup === 'create') {
      direccionCreadaEnEditar.usuarioId = usuarioId;
      await this.userService.crearDireccion(
        direccionCreadaEnEditar,
        this.nickUsuario,
        this.contrasena
      );
    }

    await this.ngOnInit();
    
  }
}

