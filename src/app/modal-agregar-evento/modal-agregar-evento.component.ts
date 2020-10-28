import { Component, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { EventService } from '../services/event.service';
import { EventoSindicato } from '../shared/Interfaces/Evento';

@Component({
  selector: 'app-modal-agregar-evento',
  templateUrl: './modal-agregar-evento.component.html',
  styleUrls: ['./modal-agregar-evento.component.css']
})
export class ModalAgregarEventoComponent implements OnInit {

  //FormControls

  tituloFormControl = new FormControl('', [
    Validators.required,
  ]);
  descripcionFormControl = new FormControl('', [

  ])

  fechaFormControl = new FormControl('', [
    Validators.required
  ])

  userId:any;
  idSindicato:string;

  //Validadores
  fechaCorrecta:boolean;

  constructor(public db: AngularFirestore,private eventSvc:EventService,public dialogRef: MatDialogRef<ModalAgregarEventoComponent>) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.getIdSindicato();
  }

  getIdSindicato(){

    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.data().isAdmin == true){

        this.idSindicato = this.userId;

      }
      else{
        this.idSindicato = snapshotChanges.data().idOrg;
      }
    })
  }

  onAgregarEvento(){

    
    const momentDate = new Date(this.fechaFormControl.value);
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");
    console.log("formated date: ", formattedDate);
    var fecha = new Date(this.fechaFormControl.value);
    var fechaHoy = new Date(Date.now());
    var fechaHoyFormatted = moment(fechaHoy).format("YYYY-MM-DD");
    console.log("fecha hoy: ",fechaHoyFormatted)

    if(fechaHoyFormatted > formattedDate){

      this.fechaCorrecta = false;
      console.log("La fecha ingresada ya pasó")

    }
    else{
      this.fechaCorrecta = true;
    }
    var uuid = require("uuid");
    const id = uuid.v4();

    var evento:EventoSindicato = {
      nombre: this.tituloFormControl.value,
      descripcion:this.descripcionFormControl.value,
      fecha:formattedDate,
      idSindicato: this.idSindicato
    }

    this.eventSvc.agregarEvento(evento,id);
    this.dialogRef.close()

  }

  onCerrar(){
this.dialogRef.close();
  }

}
