import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore';
import { Reunion } from '../shared/Interfaces/Reunion';
import { MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor( public fireservices: AngularFirestore,private snackbar: MatSnackBar,
    public db: AngularFirestore) {}


    addMeeting (reunion:Reunion,userId: any){

      let reunionCreada = {
        idCreador: reunion.idCreador,
        titulo: reunion.titulo,
        descripcion: reunion.descripcion,
        fecha: reunion.fecha,
        horaInicio:reunion.horaInicio,
        horaTermino:reunion.horaTermino,
      }
      var uuid = require("uuid");
      var id = uuid.v4();
      const reunionRef: AngularFirestoreDocument<any> = this.db.doc(`Reunion/${id}`);
      this.snackbar.open("Reunión agendada exitosamente!",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });
      return reunionRef.set(reunionCreada,{merge: true});
    }
}
