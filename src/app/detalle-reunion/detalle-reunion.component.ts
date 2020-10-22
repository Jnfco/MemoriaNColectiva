import { Component, OnInit, Inject } from '@angular/core';
import { snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerDocumentoHistorialComponent } from '../ver-documento-historial/ver-documento-historial.component';

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
idReunion:String
haveContract:boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public db: AngularFirestore) { }

  ngOnInit(): void {

    this.titulo =this.data.titulo;
    this.descripcion = this.data.descripcion,
    this.fecha= this.data.fecha,
    this.nombreAbogado = this.data.nombreAbogado,
    this.correoAbogado = this.data.correoAbogado,
    this.idReunion = this.data.idReunion
    console.log("DATA: ",this.data)
    this.contractAttached();
  }

  verContrato(){
    console.log("id reunion: ",this.idReunion)
    const dialogRef = this.dialog.open(VerDocumentoHistorialComponent, {
      width: '800px',
      data: this.idReunion
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
   
    });
  }

  contractAttached(){

    this.db.collection("Reunion").doc(this.idReunion.toString()).get().subscribe((snapshotChanges)=>{
      if(snapshotChanges.data().contractAttached == true){

        this.haveContract = true;

      }

    })
  }
}
