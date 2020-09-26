import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  OnInit } from '@angular/core';
import { Theme } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker/';
import { FormControl, Validators } from '@angular/forms';
import { Reunion } from 'src/app/shared/Interfaces/Reunion';
import * as firebase from 'firebase';

import {MeetingService} from '../../services/meeting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'modal-reunion',
  templateUrl: './modal-reunion.component.html',
  styleUrls: ['./modal-reunion.component.css']
})
export class ModalReunionComponent {


  //FormControls

  tituloFormControl = new FormControl('', [
    Validators.required,
  ]);
  descripcionFormControl = new FormControl ('',[

  ])

  fechaFormControl = new FormControl ('',[
    Validators.required
  ])
  horaInicioFormControl = new FormControl ('',[
    Validators.required
  ])
  horaTerminoFormControl = new FormControl ('',[
    Validators.required
  ])

  //Interfaz Reunion
  reunion : Reunion;
  userId: any;
  userEmail: any;

  //booleanos
  horaCorrecta = true;
  horaInicioVacia = false;
  horaTerminoVacia = false;
  tituloVacío = true;
  horaInicioMayorNoVacio = false;
  fechaVacia = true;
  listaEventos: any []
  fechaCorrecta: boolean = true;

  public idSindicatoUser:string;

  constructor(
    public dialogRef: MatDialogRef<ModalReunionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public meetingSvc: MeetingService,public snackbar: MatSnackBar,public db: AngularFirestore) {

        this.userEmail = firebase.auth().currentUser.email;
        var actualDate = moment();
        var formattedFecha =actualDate.format("YYYY-MM-DD")
        console.log("data: ",data)
      this.userId = firebase.auth().currentUser.uid;
      console.log("user id !!: ",this.userId);
        console.log('Fecha actual: ',formattedFecha);
        this.getIdSindicato();

     }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }

getIdSindicato(){
  console.log("User id:",this.userId)
  this.db.collection('users').doc(this.userId).get().subscribe((snapshotChanges)=>{
    if(snapshotChanges.exists){
      var usuario =snapshotChanges.data();
      if (usuario.uid == this.userId){

        console.log("es admin?: ",usuario.isAdmin)
        if(usuario.isAdmin == true){

          this.idSindicatoUser = this.userId;
        }
        else{

          this.idSindicatoUser = usuario.idSindicato;
        }

       
        console.log("id sindicato: ",this.idSindicatoUser)
      }
    }
  })
}

  onAgendar ():void {


    console.log("id de ahora: ",this.userId)
    const momentDate = new Date(this.fechaFormControl.value);
    momentDate.setHours (parseInt(this.horaInicioFormControl.value))
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");
    var fecha = new Date(this.fechaFormControl.value);
    var fechaHoy = new Date( Date.now());

    console.log('fecha: ',fecha)
    console.log('fecha hoy: ',fechaHoy)
    console.log('fecha ingresada es mayor que hoy?: ', fecha > fechaHoy);

    console.log('fecha sin formato: ', this.fechaFormControl.value)
    console.log ('Agendar formated date: ', formattedDate)

    this.userId = firebase.auth().currentUser.uid;
    if(fecha < fechaHoy){
        this.fechaCorrecta = false;
    }
    else if (fecha >= fechaHoy){
      this.fechaCorrecta = true;
    }


    console.log('horacorrecta: ',this.horaCorrecta);
    console.log('inicio > final ?',this.horaInicioFormControl.value > this.horaTerminoFormControl.value)
    console.log('tamaño hora inicio: ',this.horaInicioFormControl.value.length);
    console.log('hora termino size: ', this.horaTerminoFormControl.value.length)
    console.log('comparacion antes del if: ',  (this.horaInicioFormControl.value.length !=0 && this.horaTerminoFormControl.value.length !=0)) ;
    if((this.horaInicioFormControl.value < this.horaTerminoFormControl.value ))
    {
      this.horaCorrecta = true;
      if((this.horaInicioFormControl.value.length !=0 && this.horaTerminoFormControl.value.length !=0))
      {


        this.horaInicioVacia = false;
        this.horaTerminoVacia = false;
        console.log('horacorrecta: ',this.horaCorrecta);
        console.log('hora inicio vacia: ',this.horaInicioVacia);
        console.log ('hora termino vacia: ',this.horaTerminoVacia)
      }
      else {
        this.horaInicioVacia = true;
        this.horaTerminoVacia = true;
      }

    }
    else{
      this.horaCorrecta = false;
      console.log('else hora mayor menor')
      console.log('horacorrecta: ',this.horaCorrecta);
      console.log('hora inicio vacia: ',this.horaInicioVacia);
      console.log ('hora termino vacia: ',this.horaTerminoVacia)
    }
    if (this.horaCorrecta == false){

      if((this.horaInicioFormControl.value.length !=0 && this.horaTerminoFormControl.value.length !=0))
      {
        this.horaInicioVacia = false;
        this.horaTerminoVacia = false;
      }
      else {
        this.horaInicioVacia = true;
        this.horaTerminoVacia = true;
      }


    }

    if(this.horaCorrecta == true && this.fechaCorrecta == true)
    {

        console.log('horacorrecta: ',this.horaCorrecta);
        this.reunion = {
        idReunion:"",
        titulo: this.tituloFormControl.value,
        descripcion: this.descripcionFormControl.value,
        fecha: formattedDate,
        horaInicio:this.horaInicioFormControl.value,
        horaTermino: this.horaTerminoFormControl.value,
        idCreador: this.userId,
        email: this.userEmail,
        idSindicato: this.idSindicatoUser,
        started:false
      }
      if(this.reunion.horaInicio.length ==0){
        this.horaInicioVacia =true;
      }
      else if (this.reunion.horaInicio.length !=0){
        this.horaInicioVacia = false;
      }
      if(this.reunion.horaTermino.length ==0){
          this.horaTerminoVacia = true;
      }
      else if(this.reunion.horaTermino.length !=0){
        this.horaTerminoVacia = false;
      }
      if (this.reunion.horaInicio > this.reunion.horaTermino){
        this.horaCorrecta = true;
      }
      else {
        this.horaCorrecta = false;
      }

      if(this.reunion.titulo.length <=0)
      {
        this.tituloVacío = true;
      }
      else {
        this.tituloVacío = false;
      }

      if(this.horaInicioVacia == false && this.horaTerminoVacia == false && this.tituloVacío ==false)
      {
        console.log('Reunion: ',this.reunion)
        this.meetingSvc.addMeeting(this.reunion,this.userId);
        this.dialogRef.close({});
      }


    }





  }

  onCerrar ():void{
    this.dialogRef.close({});
  }


}
