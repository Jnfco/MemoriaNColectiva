import { Component, OnInit } from '@angular/core';
import { Reunion } from '../shared/Interfaces/Reunion';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalReunionComponent } from '../reunion/modal-reunion/modal-reunion.component';
import { DetalleReunionComponent } from '../detalle-reunion/detalle-reunion.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  displayedColumns: string[] = [
    'Titulo', 'Fecha', 'Detalles'
  ];
  dataSource: any;
  reuniones: Reunion[];
  tieneReuniones = false;
  constructor(public dialog: MatDialog) {

    this.tieneReuniones = true;

  }

  ngOnInit(): void {

    this.reuniones = [];
    var reunion: Reunion = {
      titulo: "Reunión 1",
      descripcion: "descripción",
      email: "email@email.com",
      fecha: "19/10/2020",
      horaInicio: "16:00",
      horaTermino: "17:00",
      idCreador: "id",
      idReunion: "id1",
      idSindicato: "id"
    }
    var reunion2: Reunion = {
      titulo: "Reunión 2",
      descripcion: "Descripcion 2",
      email: "email@no.com",
      fecha: "27/10/2020",
      horaInicio: "17:00",
      horaTermino: "20:00",
      idCreador: "id",
      idReunion: "id2",
      idSindicato: "id"
    }

    this.reuniones.push(reunion);
    this.reuniones.push(reunion2);
    this.dataSource = new MatTableDataSource<Reunion>(this.reuniones);
    console.log("data: ", this.dataSource)
  }

  verDetalle(elm) {

    
    var reunionSelect = {
      titulo: elm.titulo,
      descripcion:elm.descripcion,
      fecha: elm.fecha+"  "+elm.horaInicio+" - "+elm.horaTermino,
      idReunion:elm.idReunion,
      idSindicato:elm.idSindicato
    }
    console.log("reunion: ",reunionSelect)


    const dialogRef = this.dialog.open(DetalleReunionComponent, {
      width: '300px',
      data: reunionSelect
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //const nowDate = new Date();
      //const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);
    });
  }
}
