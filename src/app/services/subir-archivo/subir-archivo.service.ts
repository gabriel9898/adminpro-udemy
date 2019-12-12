import { Injectable } from "@angular/core";
import { resolve } from "url";
import { reject } from "q";
import { URL_SERVICIOS } from "../../config/config";

@Injectable({
  providedIn: "root"
})
export class SubirArchivoService {
  constructor() {}

  // ==================================================================================
  // Subir Archivo
  // ==================================================================================
  subirArchivo(archivo: File, tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      let formData = new FormData(); //es de java puro
      let xhr = new XMLHttpRequest();

      formData.append("imagen", archivo, archivo.name);

      xhr.onreadystatechange = function() {
        // 4 es cuando termina el proceso
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Imagen subida");
            resolve(JSON.parse(xhr.response)); // manda la respuesta 'resolve' que esta en 'response'
          } else {
            console.log("Fallo la subida");
            resolve(xhr.response);
          }
        }
      };

      let url = URL_SERVICIOS + "/upload/" + tipo + "/" + id;

      xhr.open("PUT", url, true); //el true es que quiere que sea asyncrono
      xhr.send(formData);
    });
  }
}
