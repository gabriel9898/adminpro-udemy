import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Usuario } from "src/app/models/usuario.model";
import { SubirArchivoService } from "../../services/subir-archivo/subir-archivo.service";
import { ModalUploadService } from "./modal-upload.service";

@Component({
  selector: "app-modal-upload",
  templateUrl: "./modal-upload.component.html",
  styles: []
})
export class ModalUploadComponent implements OnInit {
  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {}

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }

  // ==================================================================================
  // Seleccion Imagen: revisa que lo q se sube sea una imagen
  // ==================================================================================
  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf("image") < 0) {
      Swal.fire(
        "Solo imagenes",
        "El Archivo seleccionado no es una imagen",
        "error"
      );
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;

    //java script puro
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  subirImagen() {
    let tipo = this._modalUploadService.tipo;
    let id = this._modalUploadService.id;

    this._subirArchivoService
      .subirArchivo(this.imagenSubir, tipo, id)
      .then(resp => {
        this._modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch(err => {
        console.log("Error en la carga....");
      });
  }
}
