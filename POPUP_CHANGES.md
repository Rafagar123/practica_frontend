# Cambios en el popup de usuario

Este documento describe los cambios realizados en la aplicación para que el mismo popup sirva tanto para crear un usuario como para editar uno existente.

## Archivos modificados

- `src/app/features/user-list/user-list.component.ts`
- `src/app/features/user-list/user-list.component.html`
- `src/app/features/user-popup/user-popup.component.ts`
- `src/app/features/user-popup/user-popup.component.html`

## Qué se cambió y por qué

### 1. `user-list.component.ts`

Se creó una forma de abrir el popup en dos modos:

- `create`: para crear un usuario nuevo.
- `edit`: para modificar un usuario existente.

También se agregó una variable llamada `popupUser` que contiene los datos del usuario que se muestran dentro del popup.

Esto se hizo porque antes solo se abría un popup genérico y no había manera de saber si se estaba creando o editando, ni qué datos debían mostrarse.

#### Nuevos métodos

- `openCreatePopup()`: prepara un usuario vacío y abre el popup en modo crear.
- `openEditPopup(usuario)`: copia los datos del usuario seleccionado y abre el popup en modo editar.
- `onUserSave(usuario)`: recibe el usuario desde el popup y decide si llama a `crearUsuario()` o a `modificarUsuario()`.
- `crearUsuario(usuario)`: lugar donde se debería llamar al servicio para crear un usuario nuevo.
- `modificarUsuario(usuario)`: lugar donde se debería llamar al servicio para modificar un usuario existente.

### 2. `user-list.component.html`

Se modificó la página para que los botones de `Crear usuario` y `Editar usuario` estén en la parte superior.

- `Crear usuario` abre el popup en modo crear con un formulario vacío.
- `Editar usuario` usa el usuario seleccionado con el radio button, y abre el popup en modo editar.

También se mantuvo el formulario para enviar al componente `app-user-popup`:

- la acción actual (`mode`)
- los datos del usuario a editar o crear (`user`)
- el evento `save` para recuperar los datos cuando el usuario haga clic en Aceptar

Esto permite que el popup reciba datos desde la lista, y que la edición use explícitamente la fila seleccionada por radio.

#### Ejemplo de código en `user-list.component.html`

```html
<div class="top-actions">
  <button type="button" (click)="openCreatePopup()">Crear usuario</button>
  <button type="button" [disabled]="!usuarioSeleccionado" (click)="openEditPopupSelected()">Editar usuario</button>
</div>

<app-user-popup *ngIf="modoPopup !== 'CLOSED'"
  [mode]="modoPopup"
  [user]="popupUser"
  (save)="onUserSave($event)"
  (cerrarPopUpOk)="onCerrarPopUpOk()"
  (cerrarPopUpCancel)="onCerrarPopUpCancel()">
</app-user-popup>
```

Y en la fila de la tabla:

```html
<td><input type="radio" name="usuarioSeleccionado" [(ngModel)]="usuarioSeleccionado" [value]="usuario"></td>
```

### 3. `user-popup.component.ts`

Este componente ahora usa propiedades (`@Input` y `@Output`) para comunicarse con `user-list`.

- `@Input() mode`: indica si el popup está en modo `create` o `edit`.
- `@Input() user`: recibe el usuario que se debe mostrar en el formulario.
- `@Output() save`: emite el usuario modificado o nuevo cuando se pulsa Aceptar.

Antes el popup solo tenía botones y no recibía nada desde el componente padre, por lo que no podía rellenar datos ni saber qué acción ejecutar.

#### Ejemplo de código en `user-popup.component.ts`

```ts
@Input() mode: 'create' | 'edit' = 'create';
@Input() user: any = {};
@Output() save = new EventEmitter<any>();

async onSave() {
  this.save.emit(this.user);
  this.cerrarPopUpOk.emit();
}
```

### 4. `user-popup.component.html`

Se actualizó el formulario para que sus campos estén enlazados a `user` con `[(ngModel)]`.

- Si el popup está en modo crear, los campos aparecen vacíos.
- Si está en modo editar, los campos aparecen con los datos del usuario seleccionado.

También se cambió el título del popup de forma dinámica:

- Cuando `mode === 'create'`, muestra `Crear usuario`.
- Cuando `mode === 'edit'`, muestra `Editar usuario`.

Y se aseguró que al pulsar `Aceptar` se emita el evento `save` con los datos actuales del formulario.

#### Ejemplo de código en `user-popup.component.html`

```html
<h2>{{ mode === 'create' ? 'Crear usuario' : 'Editar usuario' }}</h2>

<input type="text" id="nickUsuario" name="nickUsuario" [(ngModel)]="user.nickUsuario">
<input type="text" id="contrasena" name="contrasena" [(ngModel)]="user.contrasena">

<select id="genero" name="genero" [(ngModel)]="user.genero">
  <option [ngValue]="{ id: '1', nombre: 'Masculino' }">Masculino</option>
  <option [ngValue]="{ id: '2', nombre: 'Femenino' }">Femenino</option>
</select>
```

## Cómo funciona desde el punto de vista del usuario

1. Pulsa el botón `Crear usuario`.
2. Se abre el popup con el formulario vacío.
3. Rellena los datos y pulsa `Aceptar`.
4. El componente padre recibe los datos y puede ejecutar el método de creación.

Para editar:

1. Selecciona un usuario con el radio button en la fila correspondiente.
2. Pulsa el botón `Editar usuario` que está arriba.
3. Se abre el popup con los campos ya rellenados.
4. Cambia lo que necesites y pulsa `Aceptar`.
5. El componente padre recibe los datos y puede ejecutar el método de modificación.

## ¿Qué falta por hacer?

Las funciones `crearUsuario()` y `modificarUsuario()` actualmente solo muestran un `console.log`.

Falta conectar esas funciones con el servicio real de usuario (`UserService`) para que la app realmente envie los datos al servidor.

---

Si quieres, también puedo crear los métodos de API concretos en `UserService` para que el popup funcione completamente. 