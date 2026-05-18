export interface Direccion {
    id: number;

    nombreCalle: string;

    numeroCalle: number | string;

    // evitar referencia circular: guardamos el id del usuario en vez del objeto completo
    usuarioId?: number;

    direccionPrincipal: boolean;
}