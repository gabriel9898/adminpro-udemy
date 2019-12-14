import { Injectable } from "@angular/core";
import { URL_SERVICIOS } from "src/app/config/config";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { UsuarioService } from "../usuario/usuario.service";
import Swal from "sweetalert2";
import { Medico } from "src/app/models/medico.model";

@Injectable({
  providedIn: "root"
})
export class MedicoService {
  totalMedico: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {}

  // ==================================================================================
  // Cargar Medicos
  // ==================================================================================
  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + "/medico?desde=" + desde;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedico = resp.total;
        return resp.medicos;
      })
    );
  }

  // ==================================================================================
  // Buscar Medicos
  // ==================================================================================
  buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + "/busqueda/coleccion/medicos/" + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }

  // ==================================================================================
  // Obtener Medico por id
  // ==================================================================================
  cargarMedico(id: string) {
    let url = URL_SERVICIOS + "/medico/" + id;

    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  }

  // ==================================================================================
  // Crear Medico y modificar
  // ==================================================================================
  crearMedico(medico: Medico) {
    let url = URL_SERVICIOS + "/medico";

    if (medico._id) {
      //Actualizando

      url += "/" + medico._id;
      url += "?token=" + this._usuarioService.token;

      return this.http.put(url, medico).pipe(
        map((resp: any) => {
          Swal.fire(
            "Medico Actualizado correctamente",
            medico.nombre,
            "success"
          );
          return resp.medico;
        })
      );
    } else {
      //Creando
      url += "?token=" + this._usuarioService.token;

      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          Swal.fire("Medico creado", medico.nombre, "success");
          return resp.medico;
        })
      );
    }
  }

  // ==================================================================================
  // Borrar Medico
  // ==================================================================================
  borrarMedico(id: string) {
    let url = URL_SERVICIOS + "/medico/" + id;
    url += "?token=" + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map(resp => {
        Swal.fire(
          "Medico borrado",
          "El medico ha sido borrado con exito.",
          "success"
        );
        return true;
      })
    );
  }
}
