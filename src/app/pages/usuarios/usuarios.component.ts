import { Component, OnInit } from "@angular/core";
import { Usuario } from "../../models/usuario.model";
import { UsuarioService } from "../../services/usuario/usuario.service";
import Swal from "sweetalert2";
import { ModalUploadService } from "../../components/modal-upload/modal-upload.service";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioServices: UsuarioService,
    public _modalUploadServices: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadServices.notificacion.subscribe(resp =>
      this.cargarUsuarios()
    );
  }

  mostrarModal(id: string) {
    this._modalUploadServices.mostrarModal("usuarios", id);
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioServices.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this._usuarioServices
      .buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioServices.usuario._id) {
      Swal.fire(
        "No puede borrar usuario",
        "No se puede borrar a si mismo.",
        "error"
      );
      return;
    }
    Swal.fire({
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar a " + usuario.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si eliminarlo!"
    }).then(result => {
      if (result.value) {
        this._usuarioServices.borrarUsuario(usuario._id).subscribe(borrado => {
          console.log(borrado);
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioServices.actualizarUsuario(usuario).subscribe();
  }
}
