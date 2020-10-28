import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-evento-sindicato',
  templateUrl: './modal-detalle-evento-sindicato.component.html',
  styleUrls: ['./modal-detalle-evento-sindicato.component.css']
})
export class ModalDetalleEventoSindicatoComponent implements OnInit {
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
