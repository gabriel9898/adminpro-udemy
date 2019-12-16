import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  SettingsService,
  SharedService,
  SidebarService,
  SubirArchivoService,
  UsuarioService,
  HospitalService,
  MedicoService,
  AdminGuard,
  LoginGuardGuard
} from "./service.index";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    SubirArchivoService,
    UsuarioService,
    HospitalService,
    MedicoService,
    AdminGuard,
    LoginGuardGuard
  ]
})
export class ServiceModule {}
