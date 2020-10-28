import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-evento-fundacion',
  templateUrl: './modal-detalle-evento-fundacion.component.html',
  styleUrls: ['./modal-detalle-evento-fundacion.component.css']
})
export class ModalDetalleEventoFundacionComponent implements OnInit {

  tituloFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', []);

  fechaFormControl = new FormControl('', [Validators.required]);
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.tituloFormControl.setValue(this.data.evento.nombre);
    this.descripcionFormControl.setValue(this.data.evento.descripcion);
    this.fechaFormControl.setValue(this.data.evento.fecha);
  }


}
