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
  horaCorrecta:boolean = true;
  horaInicioVacia = false;
  horaTerminoVacia = false;
  tituloVacío = true;

  constructor(
    public dialogRef: MatDialogRef<ModalReunionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public meetingSvc: MeetingService,public snackbar: MatSnackBar) {

     }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }



  onAgendar ():void {


    this.userId = firebase.auth().currentUser.uid;

    this.horaInicioVacia = true;
    this.horaTerminoVacia = true;
    console.log('horacorrecta: ',this.horaCorrecta);
    console.log('inicio > final ?',this.horaInicioFormControl.value > this.horaTerminoFormControl.value)
    console.log('tamaño hora inicio: ',this.horaInicioFormControl.value.length);
    if(this.horaInicioFormControl.value < this.horaTerminoFormControl.value)
    {

      this.horaCorrecta = true;
      console.log('horacorrecta: ',this.horaCorrecta);
    }
    else{
      this.horaCorrecta = false;
      console.log('horacorrecta: ',this.horaCorrecta);
    }

    if(this.horaCorrecta == true)
    {
      console.log('horacorrecta: ',this.horaCorrecta);
      this.reunion = {
        titulo: this.tituloFormControl.value,
        descripcion: this.descripcionFormControl.value,
        fecha:this.fechaFormControl.value.getFullYear()+"-"+this.fechaFormControl.value.getMonth()+"-"+this.fechaFormControl.value.getDay(),
        horaInicio:this.horaInicioFormControl.value,
        horaTermino: this.horaTerminoFormControl.value,
        idCreador: this.userId
      }
      if(this.reunion.horaInicio.length <=0){
        this.horaInicioVacia =true;
      }
      else{
        this.horaInicioVacia = false;
      }
      if(this.reunion.horaTermino.length <=0){
          this.horaTerminoVacia = true;
      }
      else{
        this.horaTerminoVacia = false;
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
