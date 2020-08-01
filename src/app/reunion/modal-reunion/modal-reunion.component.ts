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

  constructor(
    public dialogRef: MatDialogRef<ModalReunionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }



  onAgendar ():void {


    this.userId = firebase.auth().currentUser.uid;

    this.reunion = {
      titulo: this.tituloFormControl.value,
      descripcion: this.descripcionFormControl.value,
      fecha:this.fechaFormControl.value.getFullYear()+"-"+this.fechaFormControl.value.getMonth()+"-"+this.fechaFormControl.value.getDay(),
      horaInicio:this.horaInicioFormControl.value,
      horaTermino: this.horaTerminoFormControl.value,
      idCreador: this.userId
    }

    console.log('Reunion: ',this.reunion)


    this.dialogRef.close({});
  }

  onCerrar ():void{
    this.dialogRef.close({});
  }


}
