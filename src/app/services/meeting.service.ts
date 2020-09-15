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
      var uuid = require("uuid");
      var id = uuid.v4();
      let reunionCreada = {
        idReunion:id,
        idCreador: reunion.idCreador,
        titulo: reunion.titulo,
        descripcion: reunion.descripcion,
        fecha: reunion.fecha,
        horaInicio:reunion.horaInicio,
        horaTermino:reunion.horaTermino,
        email:reunion.email,
        idSindicato:reunion.idSindicato
      }

      const reunionRef: AngularFirestoreDocument<any> = this.db.doc(`Reunion/${id}`);
      this.snackbar.open("Reunión agendada exitosamente!",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });
      return reunionRef.set(reunionCreada,{merge: true});
    }



    updateMeeting (reunion:Reunion, userId: any , reunionId:string){

      let reunionCreada = {
        idReunion:reunionId,
        idCreador: reunion.idCreador,
        titulo: reunion.titulo,
        descripcion: reunion.descripcion,
        fecha: reunion.fecha,
        horaInicio:reunion.horaInicio,
        horaTermino:reunion.horaTermino,
        emailCreador: reunion.email
      }

      this.snackbar.open("Reunión modificada exitosamente!",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });
      return this.fireservices.collection("Reunion").doc(reunionId).set(reunionCreada,{merge:true});


    }

    deleteMeeting (userId:any, reunionId:string){

      this.snackbar.open("Reunión eliminada exitosamente!",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });

      return this.fireservices.collection("Reunion").doc(reunionId).delete();

    }


}
