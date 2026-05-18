import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../models/user.model';
import { Direccion } from '../models/direccion.model';
import to from "./utils.service";
import ConstUrls from 'src/app/shared/contants/const-urls';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  /*async obtenerUsuarioPorId(id: number) {
    return await to(
      this.http
        .get<Usuario>()
        .toPromise()
    )
  }
*/
  async obtenerUsuarios(nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
      .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);
    return await to(
      this.http
        .get<Usuario[]>(
          `${ConstUrls.API_URL}/api/v1/usuarios/usuarios`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerDireccionPrincipal(usuarioId: number, nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
      .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);
    return await to(
      this.http
        .get<Direccion[]>(
          `${ConstUrls.API_URL}/api/v1/direcciones/direc-por-usuario/${usuarioId}`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerGeneros(nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
      .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);
    return await to(
      this.http
        .get<any>(
          `${ConstUrls.API_URL}/api/v1/generos/generos`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerPuestos(nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
      .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);
    return await to(
      this.http
        .get<any>(
          `${ConstUrls.API_URL}/api/v1/puestosTrabajo/puestos`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async crearUsuario(body: Usuario, nickUsuario: string, contrasena: string) {
    try {

      const params = new HttpParams()
        .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
        .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);

      const sanitizedBody: any = {
        nickUsuario: body.nickUsuario,
        contrasena: body.contrasena,
        genero: body.genero,
        nombre: body.nombre,
        primerApellido: body.primerApellido,
        segundoApellido: body.segundoApellido,
        puestoDeTrabajo: body.puestoDeTrabajo,
        esAdmin: body.esAdmin
      };

      if (body.fechaNacimiento) {
        sanitizedBody.fechaNacimiento = body.fechaNacimiento;
      }

      if (
        typeof body.horaDesayuno === 'string' &&
        body.horaDesayuno.trim() !== ''
      ) {

        sanitizedBody.horaDesayuno =
          body.horaDesayuno.length === 5
            ? `${body.horaDesayuno}:00`
            : body.horaDesayuno;
      }

      console.log('BODY ENVIADO:', sanitizedBody);

      const response = await firstValueFrom(
        this.http.post<any>(
          `${ConstUrls.API_URL}/api/v1/usuarios/usuario`,
          sanitizedBody,
          {
            params
          }
        )
      );
      return response;
    } catch (error) {
      console.error('ERROR COMPLETO:', error);
      throw error;
    }
  }

    async editarUsuario(body: Usuario, nickUsuario: string, contrasena: string) {
    try {

      const params = new HttpParams()
        .set(ConstUrls.NICK_USUARIO_PARAM, nickUsuario)
        .set(ConstUrls.PASS_USUARIO_PARAM, contrasena);

      const sanitizedBody: any = {
        id: body.id,
        nickUsuario: body.nickUsuario,
        contrasena: body.contrasena,
        genero: body.genero,
        nombre: body.nombre,
        primerApellido: body.primerApellido,
        segundoApellido: body.segundoApellido,
        puestoDeTrabajo: body.puestoDeTrabajo,
        esAdmin: body.esAdmin
      };

      if (body.fechaNacimiento) {
        sanitizedBody.fechaNacimiento = body.fechaNacimiento;
      }

      if (
        typeof body.horaDesayuno === 'string' &&
        body.horaDesayuno.trim() !== ''
      ) {

        sanitizedBody.horaDesayuno =
          body.horaDesayuno.length === 5
            ? `${body.horaDesayuno}:00`
            : body.horaDesayuno;
      }

      console.log('BODY ENVIADO:', sanitizedBody);

      const response = await firstValueFrom(
        this.http.post<any>(
          `${ConstUrls.API_URL}/api/v1/usuarios/usuario/${body.id}`,
          sanitizedBody,
          {
            params
          }
        )
      );
      return response;
    } catch (error) {
      console.error('ERROR COMPLETO:', error);
      throw error;
    }
  }

}
