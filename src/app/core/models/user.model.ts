import {Genero} from "./genero.model";
import {PuestoDeTrabajo} from "./puestodetrabajo.model";

// NOTE: la API maneja las fechas como cadenas ISO (string). Para evitar
// incompatibilidades con los payloads recibidos/enviados, usamos `string`.
export interface Usuario {
  id: number | null;
  nickUsuario: string | null;
  nombre: string | null;
  contrasena: string | null;
  fechaHoraCreacion: string | null; // ISO string (ej. "2026-05-07T22:01:47")
  genero: Genero | null;
  primerApellido: string | null;
  segundoApellido: string | null;
  fechaNacimiento: string | null; // YYYY-MM-DD
  horaDesayuno: string | null; // HH:MM:SS
  puestoDeTrabajo: PuestoDeTrabajo | null;
  esAdmin: boolean;
  direccionPrincipal?: { nombreCalle: string; numeroCalle: string | number } | null;
  direccionesExtra?: number;
  icono?: string;
}

export const usuarioInicial: Usuario = {
  id: null,
  nickUsuario: null,
  nombre: null,
  contrasena: null,
  fechaHoraCreacion: new Date().toISOString(),
  genero: {
    id: null,
    nombre: null
  },
  primerApellido: null,
  segundoApellido: null,
  fechaNacimiento: null,
  horaDesayuno: null,
  puestoDeTrabajo: {
    id: null,
    nombre: null
  },
  esAdmin: false,
};
