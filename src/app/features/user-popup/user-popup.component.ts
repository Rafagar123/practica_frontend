import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [ CommonModule, FormsModule ]
})
export class UserPopupComponent implements OnInit {

    @Input() mode: 'create' | 'edit' = 'create';
    @Input() user: any = {};
    @Output() save = new EventEmitter<any>();
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();

    constructor() {
    }

    async ngOnInit() {
        this.user = this.user || {};
    }

    async onSave() {
        this.save.emit(this.user);
        this.cerrarPopUpOk.emit();
    }

    onCancel() {
        this.cerrarPopUpCancel.emit();
    }
}
