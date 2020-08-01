import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  OnInit } from '@angular/core';
import { Theme } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker/';
import { FormControl, Validators } from '@angular/forms';
import { Reunion } from 'src/app/shared/Interfaces/Reunion';

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

  constructor(
    public dialogRef: MatDialogRef<ModalReunionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }



  onAgendar ():void {
    console.log('Titulo', this.tituloFormControl.value)
    console.log('Descripcion', this.descripcionFormControl.value)
    console.log('Fecha', this.fechaFormControl.value)
    console.log('Hora Inicio', this.horaInicioFormControl.value)
    console.log('Hora Término', this.horaTerminoFormControl.value)

    var r= {
      titulo: this.tituloFormControl.value,
      descripcion: this.descripcionFormControl.value,
      fecha:this.fechaFormControl.value,
      horaInicio:this.horaInicioFormControl.value,
      horaTermino: this.horaTerminoFormControl.value
    }

    this.dialogRef.close({});
  }

  onCerrar ():void{
    this.dialogRef.close({});
  }


}
