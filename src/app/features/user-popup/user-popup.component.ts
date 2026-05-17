import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class UserPopupComponent implements OnInit {

    @Input() mode: 'create' | 'edit' = 'create';
    @Input() user: any = {};
    @Output() save = new EventEmitter<any>();
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();
    userService: UserService;
    @Input() generos: any[] = [];

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async ngOnInit() {
        this.user = this.user || {};
        await this.cargarGeneros();
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

    compararGeneros(g1: any, g2: any): boolean {
        return g1 && g2 ? g1.id === g2.id : g1 === g2;
    }
}
