import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-reunion',
  templateUrl: './detalle-reunion.component.html',
  styleUrls: ['./detalle-reunion.component.css']
})
export class DetalleReunionComponent implements OnInit {
titulo:string
descripcion:string
fecha:string
nombreAbogado:string
correoAbogado:string

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.titulo =this.data.titulo;
    this.descripcion = this.data.descripcion,
    this.fecha= this.data.fecha,
    this.nombreAbogado = this.data.nombreAbogado,
    this.correoAbogado = this.data.correoAbogado
  }

}
