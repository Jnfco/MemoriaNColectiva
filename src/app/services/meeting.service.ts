import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Reunion } from '../shared/Interfaces/Reunion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contrato } from '../shared/Interfaces/Contrato';
import { snapshotChanges } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(public fireservices: AngularFirestore, private snackbar: MatSnackBar,
    public db: AngularFirestore,public http:HttpClient) { }


  addMeeting(reunion: Reunion) {
    var uuid = require("uuid");
    var id = uuid.v4();
    let reunionCreada = {
      idReunion: id,
      idCreador: reunion.idCreador,
      titulo: reunion.titulo,
      descripcion: reunion.descripcion,
      fecha: reunion.fecha,
      horaInicio: reunion.horaInicio,
      horaTermino: reunion.horaTermino,
      email: reunion.email,
      idSindicato: reunion.idSindicato,
      started: reunion.started,
      idAbogado: reunion.idAbogado,
      idFundacion: reunion.idFundacion
    }

    const reunionRef: AngularFirestoreDocument<any> = this.db.doc(`Reunion/${id}`);
    this.snackbar.open("Reunión agendada exitosamente!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return reunionRef.set(reunionCreada, { merge: true });
  }

  sentMeetingEmail(idSindicato: string, reunion: Reunion) {

    this.db.collection("Sindicato").doc(idSindicato).get().subscribe((snapshotChanges) => {

      snapshotChanges.data().usuarios.forEach(element => {

        var url = "http://localhost:5001/negociacioncolectiva-80355/us-central1/sendMail?dest=" + element.correo +
          "&horaInicio=" + reunion.horaInicio +
          "&horaTermino=" + reunion.horaTermino +
          "&titulo=" + reunion.titulo +
          "&fecha=" + reunion.fecha +
          "&nombreSindicato=" + snapshotChanges.data().nombreSindicato;
         var postData = {
            test: 'my content',
          };
          this.http.post(url,postData).toPromise().then((data:any)=>{
            console.log("data: ",data)
          })
      });
    })






  }
  updateMeeting(reunion: Reunion, reunionId: string) {

    let reunionCreada = {
      idReunion: reunionId,
      idCreador: reunion.idCreador,
      titulo: reunion.titulo,
      descripcion: reunion.descripcion,
      fecha: reunion.fecha,
      horaInicio: reunion.horaInicio,
      horaTermino: reunion.horaTermino,
      emailCreador: reunion.email

    }

    this.snackbar.open("Reunión modificada exitosamente!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return this.fireservices.collection("Reunion").doc(reunionId).set(reunionCreada, { merge: true });


  }



  startMeeting(reunion: Reunion) {

    this.snackbar.open("Reunión iniciada!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return this.fireservices.collection("Reunion").doc(reunion.idReunion).set(reunion, { merge: true });
  }

  startMeetingWithContract(reunion: Reunion, contrato: Contrato) {


    var contratoR = {
      content: contrato.content

    }

    var reunionContrato = {

      descripcion: reunion.descripcion,
      email: reunion.email,
      fecha: reunion.fecha,
      horaInicio: reunion.horaInicio,
      horaTermino: reunion.horaTermino,
      idAbogado: reunion.idAbogado,
      idCreador: reunion.idCreador,
      idFundacion: reunion.idFundacion,
      idReunion: reunion.idReunion,
      idSindicato: reunion.idSindicato,
      started: true,
      titulo: reunion.titulo,
      contrato: contratoR,
      contractAttached: true


    }

    this.snackbar.open("Reunión iniciada!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return this.fireservices.collection("Reunion").doc(reunion.idReunion).set(reunionContrato, { merge: true });
  }

  deleteMeeting(userId: any, reunionId: string) {

    this.snackbar.open("Reunión eliminada exitosamente!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });

    return this.fireservices.collection("Reunion").doc(reunionId).delete();

  }


}
