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

  //booleanos
  horaCorrecta = true;
  horaInicioVacia = false;
  horaTerminoVacia = false;
  tituloVacío = true;
  horaInicioMayorNoVacio = false;
  fechaVacia = true;

  constructor(
    public dialogRef: MatDialogRef<ModalReunionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public meetingSvc: MeetingService,public snackbar: MatSnackBar) {

     }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }



  onAgendar ():void {

    const momentDate = new Date(this.fechaFormControl.value);
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");

    this.userId = firebase.auth().currentUser.uid;


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

    if(this.horaCorrecta == true)
    {

        console.log('horacorrecta: ',this.horaCorrecta);
        this.reunion = {
        titulo: this.tituloFormControl.value,
        descripcion: this.descripcionFormControl.value,
        fecha: formattedDate,
        horaInicio:this.horaInicioFormControl.value,
        horaTermino: this.horaTerminoFormControl.value,
        idCreador: this.userId
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
