import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscriber, Subscription } from "rxjs";
import { retry, map, filter } from "rxjs/operators";

@Component({
  selector: "app-rxjs",
  templateUrl: "./rxjs.component.html",
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
      // .pipe(retry(2)) // ayuda a q el proseso reinicie apesar de un error con su respectivo numero de intentos
      .subscribe(
        numero => console.log("Subs", numero),
        error => console.error("Error en el obs", error),
        () => console.log("El observador termino")
      );
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.log("la pagina se va a cerrar");
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador++;

        const salida = {
          valor: contador
        };

        observer.next(salida);
        // if (contador === 3) {
        //   clearInterval(intervalo); //termina el intervalo
        //   observer.complete(); //hace que acabe todo y no espere ninguna cosa
        // }
        // if (contador === 2) {
        //   clearInterval(intervalo); //termina el intervalo
        //   observer.error("Auxilioooo");
        // }
      }, 1000);
    }).pipe(
      map(resp => resp.valor),
      filter((valor, index) => {
        if (valor % 2 === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
