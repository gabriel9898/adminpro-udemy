import { Component, OnInit } from "@angular/core";
import { Medico } from "../../models/medico.model";
import { MedicoService } from "../../services/service.index";
import Swal from "sweetalert2";

@Component({
  selector: "app-medicos",
  templateUrl: "./medicos.component.html",
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  cargando: boolean = true;
  desde: number = 0;

  constructor(public _medicosServices: MedicoService) {}

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicosServices.cargarMedicos(this.desde).subscribe(medicos => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicosServices.buscarMedicos(termino).subscribe(medicos => {
      this.medicos = medicos;

      this.cargando = false;
    });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar a " + medico.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si eliminarlo!"
    }).then(result => {
      if (result.value) {
        this._medicosServices.borrarMedico(medico._id).subscribe(borrado => {
          this.cargarMedicos();
        });
      }
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this._medicosServices.totalMedico) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }
}
