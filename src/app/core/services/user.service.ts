import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../models/user.model';
import to from "./utils.service";
import ConstUrls from 'src/app/shared/contants/const-urls';



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
        .get<any>(
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
        .get<any>(
          `${ConstUrls.API_URL}/api/v1/direcciones/direc-por-usuario/${usuarioId}`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

}
