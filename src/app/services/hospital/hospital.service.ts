import { Injectable } from "@angular/core";
import { Hospital } from "../../models/hospital.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { URL_SERVICIOS } from "src/app/config/config";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";

import { UsuarioService } from "../usuario/usuario.service";

@Injectable({
  providedIn: "root"
})
export class HospitalService {
  hospital: Hospital;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioServices: UsuarioService
  ) {
    this.token = _usuarioServices.token;
  }

  // ==================================================================================
  // Cargar Hospitales
  // ==================================================================================
  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + "/hospital?desde=" + desde;

    return this.http.get(url);
  }

  // ==================================================================================
  // Obtener Hospital Segun Id
  // ==================================================================================
  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + "/hospital/" + id;

    return this.http.get(url).pipe(map((resp: any) => resp.hospital));
  }
  // ==================================================================================
  // Buscar Hospital
  // ==================================================================================
  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + "/busqueda/coleccion/hospitales/" + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.hospitales));
  }

  // ==================================================================================
  // Crear Hospital
  // ==================================================================================
  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + "/hospital";
    url += "?token=" + this.token;

    return this.http.post(url, { nombre }).pipe(
      map((resp: any) => {
        Swal.fire("Hospital creado", nombre, "success");
        return resp.hospital;
      })
    );
  }

  // ==================================================================================
  // Borrar Hospital
  // ==================================================================================
  borrarHospital(id: string) {
    let url = URL_SERVICIOS + "/hospital/" + id;
    url += "?token=" + this.token;

    return this.http.delete(url).pipe(
      map(resp => {
        Swal.fire(
          "Borrado!",
          "El Hospital ha sido borrado con exito.",
          "success"
        );
        return true;
      })
    );
  }

  // ==================================================================================
  // Actualizar Hospital
  // ==================================================================================
  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + "/hospital/" + hospital._id;
    url += "?token=" + this.token;

    return this.http.put(url, hospital).pipe(
      map((resp: any) => {
        Swal.fire("Hospital actualizado", hospital.nombre, "success");
        return resp.hospital;
      })
    );
  }
}
