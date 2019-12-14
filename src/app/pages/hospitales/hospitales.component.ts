import { Component, OnInit } from "@angular/core";
import { Hospital } from "../../models/hospital.model";
import { HospitalService } from "../../services/service.index";
import { ModalUploadService } from "src/app/components/modal-upload/modal-upload.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-hospitales",
  templateUrl: "./hospitales.component.html",
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalServices: HospitalService,
    public _modalUploadServices: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadServices.notificacion.subscribe(resp =>
      this.cargarHospitales()
    );
  }

  mostrarModal(id: string) {
    this._modalUploadServices.mostrarModal("hospitales", id);
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalServices
      .cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;

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
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;

    this._hospitalServices
      .buscarHospital(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  async crearHospital() {
    const ipAPI = "//api.ipify.org?format=json";

    const inputValue = fetch(ipAPI)
      .then(response => response.json())
      .then(data => data.ip);

    const { value: nombreHospital } = await Swal.fire({
      title: "Crear Hospital",
      text: "Ingrese nombre de Hospital",
      input: "text",
      icon: "info",
      inputValue,
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "Tiene que ingresar un nombre de Hospital";
        }
      }
    });

    if (nombreHospital) {
      this._hospitalServices.crearHospital(nombreHospital).subscribe(() => {
        this.cargarHospitales();
      });
    }
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar a " + hospital.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si eliminarlo!"
    }).then(result => {
      if (result.value) {
        this._hospitalServices
          .borrarHospital(hospital._id)
          .subscribe(borrado => {
            this.cargarHospitales();
          });
      }
    });
  }

  guardarHospital(hospital: Hospital) {
    if (hospital.nombre.length <= 0) {
      Swal.fire(
        "Validacion",
        "El nombre del hospital no puede estar vacio.",
        "error"
      );
      return;
    }
    this._hospitalServices
      .actualizarHospital(hospital)
      .subscribe(() => this.cargarHospitales());
  }
}
