import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventoFundacion, EventoSindicato } from '../shared/Interfaces/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(public db: AngularFirestore, private snackbar: MatSnackBar, public fireservices: AngularFirestore) { }


  agregarEvento(evento:EventoSindicato,id:any){

    var event = {
      nombre:evento.nombre,
      descripcion:evento.descripcion,
      idSindicato: evento.idSindicato,
      fecha:evento.fecha,
      id:id
    }
   
    const eventRef: AngularFirestoreDocument<any> = this.db.doc(
      `Evento/${id}`
    );
    this.snackbar.open("Evento agregado exitosamente!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return eventRef.set(event, { merge: true });

  }

  agregarEventoFundacion(evento:EventoFundacion,id:any){
    var event = {
      nombre:evento.nombre,
      descripcion:evento.descripcion,
      idSindicato: evento.idSindicato,
      idFundacion: evento.idFundacion,
      fecha:evento.fecha,
      id:id
    }
   
    const eventRef: AngularFirestoreDocument<any> = this.db.doc(
      `Evento/${id}`
    );
    this.snackbar.open("Evento agregado exitosamente!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return eventRef.set(event, { merge: true });


  }
}
