import { Component, OnInit, Inject } from '@angular/core';
import { Reunion } from '../shared/Interfaces/Reunion';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeetingService } from '../services/meeting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { snapshotChanges } from '@angular/fire/database';

@Component({
  selector: 'app-modal-info-reunion-fundacion',
  templateUrl: './modal-info-reunion-fundacion.component.html',
  styleUrls: ['./modal-info-reunion-fundacion.component.css']
})
export class ModalInfoReunionFundacionComponent implements OnInit {

   //FormControls

   tituloFormControl = new FormControl('', [Validators.required]);
   descripcionFormControl = new FormControl('', []);
 
   fechaFormControl = new FormControl('', [Validators.required]);
   horaInicioFormControl = new FormControl('', [Validators.required]);
   horaTerminoFormControl = new FormControl('', [Validators.required]);
 
   //Interfaz Reunion
   reunion: Reunion;
   userId: any;
   userEmail: any;
 
   //booleanos
   horaCorrecta = true;
   horaInicioVacia = false;
   horaTerminoVacia = false;
   tituloVacío = true;
   horaInicioMayorNoVacio = false;
   fechaVacia = true;
   modificar = false;
   fechaCorrecta = true;
 
   listaEventos: any[];
   idReunion: string;
   public idSindicatoUser:string;
   public started:boolean;
   public nombreSindicato:string;
   public adminSindicato:string;
 
   constructor(
     public dialogRef: MatDialogRef<ModalInfoReunionFundacionComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public meetingSvc: MeetingService,
     public snackbar: MatSnackBar,
     public db:AngularFirestore
   ) {
    this.idSindicatoUser = data.reunion.idSindicato;
    this.getInfoAdminSindicato();
     this.getNombreSindicato();
     this.started = this.data.reunion.started;
     this.userId = firebase.auth().currentUser.uid;
     this.userEmail = firebase.auth().currentUser.email;
     console.log('Reunion: ', this.data.reunion);
     this.idReunion = this.data.reunion.idReunion;
     this.tituloFormControl.setValue(this.data.reunion.titulo);
     this.descripcionFormControl.setValue(this.data.reunion.descripcion);
     this.fechaFormControl.setValue(this.data.reunion.fecha);
 
     const momentDate = new Date(this.fechaFormControl.value);
     momentDate.setDate(momentDate.getDate() +2);
     const formattedDate = moment(momentDate).format('YYYY-MM-DD');
     this.fechaFormControl.setValue(formattedDate);
     console.log('Fecha despues de set value: ',this.fechaFormControl)
     this.horaInicioFormControl.setValue(this.data.reunion.horaInicio);
     this.horaTerminoFormControl.setValue(this.data.reunion.horaTermino);
 
 
     console.log('formatedd date:',formattedDate)
     console.log("id de la reunion: ",this.data.reunion.idReunion)
     console.log("started desde afuera: ",this.data.reunion.started)
     

     
     
     //this.fechaFormControl.setValue(momentDate.toUTCString())
   }
  ngOnInit(): void {
    
  }

  getNombreSindicato(){

    this.db.collection("Sindicato").doc(this.idSindicatoUser).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.exists){

        console.log("existe")
        this.nombreSindicato = snapshotChanges.data().nombreSindicato;
        console.log("nombreSindicato: ",this.nombreSindicato)

      }
    })
  }

  getInfoAdminSindicato(){

    this.db.collection("users").doc(this.data.reunion.idSindicato).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.exists){

        this.adminSindicato= snapshotChanges.data().name + " / "+snapshotChanges.data().email
      }
    })
    
  }
 
   onNoClick(): void {
     this.dialogRef.close({});
     
   }
   
 
   onEliminar(){
     this.meetingSvc.deleteMeeting(this.userId,this.idReunion);
     this.dialogRef.close({});
   }
 
   
 
   onModificar() {
     const momentDate = new Date(this.fechaFormControl.value);
     const formattedDate = moment(momentDate).format('YYYY-MM-DD');
 
     this.userId = firebase.auth().currentUser.uid;
 
     var fecha = new Date(this.fechaFormControl.value);
     var fechaHoy = new Date( Date.now());
 
     this.userId = firebase.auth().currentUser.uid;
     if(fecha < fechaHoy){
         this.fechaCorrecta = false;
     }
     else if (fecha >= fechaHoy){
       this.fechaCorrecta = true;
     }
 
     console.log('horacorrecta: ', this.horaCorrecta);
     console.log(
       'inicio > final ?',
       this.horaInicioFormControl.value > this.horaTerminoFormControl.value
     );
     console.log(
       'tamaño hora inicio: ',
       this.horaInicioFormControl.value.length
     );
     console.log(
       'hora termino size: ',
       this.horaTerminoFormControl.value.length
     );
     console.log(
       'comparacion antes del if: ',
       this.horaInicioFormControl.value.length != 0 &&
         this.horaTerminoFormControl.value.length != 0
     );
     if (this.horaInicioFormControl.value < this.horaTerminoFormControl.value) {
       this.horaCorrecta = true;
       if (
         this.horaInicioFormControl.value.length != 0 &&
         this.horaTerminoFormControl.value.length != 0
       ) {
         this.horaInicioVacia = false;
         this.horaTerminoVacia = false;
         console.log('horacorrecta: ', this.horaCorrecta);
         console.log('hora inicio vacia: ', this.horaInicioVacia);
         console.log('hora termino vacia: ', this.horaTerminoVacia);
       } else {
         this.horaInicioVacia = true;
         this.horaTerminoVacia = true;
       }
     } else {
       this.horaCorrecta = false;
       console.log('else hora mayor menor');
       console.log('horacorrecta: ', this.horaCorrecta);
       console.log('hora inicio vacia: ', this.horaInicioVacia);
       console.log('hora termino vacia: ', this.horaTerminoVacia);
     }
     if (this.horaCorrecta == false) {
       if (
         this.horaInicioFormControl.value.length != 0 &&
         this.horaTerminoFormControl.value.length != 0
       ) {
         this.horaInicioVacia = false;
         this.horaTerminoVacia = false;
       } else {
         this.horaInicioVacia = true;
         this.horaTerminoVacia = true;
       }
     }
 
     if (this.horaCorrecta == true && this.fechaCorrecta ==true) {
       console.log('horacorrecta: ', this.horaCorrecta);
       this.reunion = {
         idReunion: '',
         titulo: this.tituloFormControl.value,
         descripcion: this.descripcionFormControl.value,
         fecha: formattedDate,
         horaInicio: this.horaInicioFormControl.value,
         horaTermino: this.horaTerminoFormControl.value,
         idCreador: this.userId,
         email: this.userEmail,
         idSindicato: this.idSindicatoUser,
         idAbogado:this.data.reunion.idAbogado,
         idFundacion:this.data.reunion.idFundacion,
         started:false
       };
       if (this.reunion.horaInicio.length == 0) {
         this.horaInicioVacia = true;
       } else if (this.reunion.horaInicio.length != 0) {
         this.horaInicioVacia = false;
       }
       if (this.reunion.horaTermino.length == 0) {
         this.horaTerminoVacia = true;
       } else if (this.reunion.horaTermino.length != 0) {
         this.horaTerminoVacia = false;
       }
       if (this.reunion.horaInicio > this.reunion.horaTermino) {
         this.horaCorrecta = true;
       } else {
         this.horaCorrecta = false;
       }
 
     
       if (this.reunion.titulo.length <= 0) {
         this.tituloVacío = true;
       } else {
         this.tituloVacío = false;
       }
 
       if (
         this.horaInicioVacia == false &&
         this.horaTerminoVacia == false &&
         this.tituloVacío == false
       ) {
         console.log('Reunion: ', this.reunion);
         this.meetingSvc.updateMeeting(this.reunion,this.idReunion);
         this.dialogRef.close({});
       }
     }
   }
 
   onCerrar(): void {
     this.dialogRef.close({});
   }
 
   onIniciarReunion(){
 
     var reunion:Reunion = {
       titulo:this.data.reunion.titulo,
       descripcion:this.data.reunion.descripcion,
       email:this.data.reunion.email,
       fecha:this.data.reunion.fecha,
       horaInicio:this.data.reunion.horaInicio,
       horaTermino:this.data.reunion.horaTermino,
       idCreador:this.data.reunion.idCreador,
       idReunion:this.data.reunion.idReunion,
       idSindicato:this.data.reunion.idSindicato,
       idAbogado:this.data.reunion.idAbogado,
       idFundacion:this.data.reunion.idFundacion,
       started:true
     }
     this.meetingSvc.startMeeting(reunion);
     this.dialogRef.close({});
     
   }

}
