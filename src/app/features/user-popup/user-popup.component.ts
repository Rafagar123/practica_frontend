import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from 'src/app/core/services/user.service';
import { Usuario } from 'src/app/core/models/user.model';
import { Genero } from 'src/app/core/models/genero.model';
import { PuestoDeTrabajo } from 'src/app/core/models/puestodetrabajo.model';
import { Direccion } from 'src/app/core/models/direccion.model';

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class UserPopupComponent implements OnInit {

    @Input() mode: 'create' | 'edit' = 'create';
    @Input() user: Usuario | any = {};
    @Output() save = new EventEmitter<any>();
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();
    @Input() generos: Genero[] = [];
    @Input() puestos: PuestoDeTrabajo[] = [];

    userService: UserService;
    direcciones: Direccion[] = [];
    direccionSeleccionada: Direccion | null = null;
    direccionEditandoId: number | null = null;
    direccionBorrandoId: number | null = null;
    selectedDireccionPrincipalId: number | null = null;
    mostrarCrear = false;
    direccionCreadaEnEditar: Direccion | null = null;


    constructor(userService: UserService) {
        this.userService = userService;
    }

    async ngOnInit() {
        this.user = this.user || {};
        await this.cargarGeneros();
        await this.cargarPuestos();
        if (this.mode === 'edit') {
            await this.cargarDirecciones();
        }
    }

    async onSave() {
        this.onPrincipalChange(this.selectedDireccionPrincipalId);

        const payload = {
            usuario: this.user,
            direcciones: this.direcciones,
            idBorrar: this.direccionBorrandoId,
            direccionCreadaEnEditar: this.direccionCreadaEnEditar
        };
        this.save.emit(payload);
        this.cerrarPopUpOk.emit();
    }

    onCancel() {
        this.cerrarPopUpCancel.emit();
    }

    async cargarGeneros(): Promise<void> {
        const nick = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        try {
            const response = await this.userService.obtenerGeneros(nick, contrasena);
            this.generos = response || [];
            console.log('Generos cargados correctamente');
        } catch (error) {
            console.error('Error al cargar generos:', error);
        }

    }

    async cargarPuestos(): Promise<void> {
        const nick = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        try {
            const response = await this.userService.obtenerPuestos(nick, contrasena);
            this.puestos = response || [];
            console.log('Puestos cargados correctamente');
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        }

    }

    async cargarDirecciones(): Promise<void> {
        const nick = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        try {
            const response = await this.userService.obtenerDirecciones(this.user.id, nick, contrasena);
            this.direcciones = response || [];
            this.selectedDireccionPrincipalId = this.direcciones.find(d => d.direccionPrincipal)?.id ?? null;
            console.log('Direcciones cargadas correctamente');
        } catch (error) {
            console.error('Error al cargar direcciones:', error);
        }
    }

    onPrincipalChange(selectedId: number | null): void {
        this.selectedDireccionPrincipalId = selectedId;
        this.direcciones.forEach(direccion => {
            direccion.direccionPrincipal = selectedId !== null && direccion.id === selectedId;
        });
    }

    compararGeneros(g1: Genero | null, g2: Genero | null): boolean {
        return g1 && g2 ? g1.id === g2.id : g1 === g2;
    }

    compararPuestos(p1: PuestoDeTrabajo | null, p2: PuestoDeTrabajo | null): boolean {
        return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }

    seleccionarDireccion(direccion: Direccion) {

        this.direccionSeleccionada = direccion;
    }

    editarDireccionSeleccionada() {

        if (!this.direccionSeleccionada?.id) {
            return;
        }

        this.direccionEditandoId = this.direccionSeleccionada.id;
    }

    esDireccionEditando(direccion: Direccion): boolean {
        return direccion.id === this.direccionEditandoId;
    }

    marcarComoPrincipal(direccionSeleccionada: Direccion) {

        this.direcciones.forEach(direccion => {

            direccion.direccionPrincipal = false;
        });

        direccionSeleccionada.direccionPrincipal = true;
    }

    borrarDireccionSeleccionada() {
        var resultado = confirm("¿Estás seguro de que deseas eliminar esta dirección?");

        if (!this.direccionSeleccionada?.id || !resultado) {
            return;
        }

        this.direccionBorrandoId = this.direccionSeleccionada.id;
    }

    muestraCrear(): void {
        this.mostrarCrear = !this.mostrarCrear;

        if (this.mostrarCrear && !this.direccionCreadaEnEditar) {

            if (this.mode === 'edit' && this.user.id) {
                this.direccionCreadaEnEditar = {
                    id: 0,
                    nombreCalle: '',
                    numeroCalle: 0,
                    direccionPrincipal: false,
                    usuarioId: this.user.id
                }
            } if (this.mode === 'create') {
                this.direccionCreadaEnEditar = {
                    id: 0,
                    nombreCalle: '',
                    numeroCalle: 0,
                    direccionPrincipal: false,
                    usuarioId: 0
                }
            }
        }
    }

}
