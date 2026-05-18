import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from 'src/app/core/services/user.service';
import { Usuario } from 'src/app/core/models/user.model';
import { Genero } from 'src/app/core/models/genero.model';
import { PuestoDeTrabajo } from 'src/app/core/models/puestodetrabajo.model';

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
    @Output() save = new EventEmitter<Usuario>();
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();
    userService: UserService;
    @Input() generos: Genero[] = [];
    @Input() puestos: PuestoDeTrabajo[] = [];

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async ngOnInit() {
        this.user = this.user || {};
        await this.cargarGeneros();
        await this.cargarPuestos();
    }

    async onSave() {
        this.save.emit(this.user);
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

    compararGeneros(g1: Genero | null, g2: Genero | null): boolean {
        return g1 && g2 ? g1.id === g2.id : g1 === g2;
    }

    compararPuestos(p1: PuestoDeTrabajo | null, p2: PuestoDeTrabajo | null): boolean {
        return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }
}
