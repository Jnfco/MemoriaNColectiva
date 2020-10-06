import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FundacionService } from '../services/fundacion.service';
import { ModalInfoReunionComponent } from '../reunion/modal-info-reunion/modal-info-reunion.component';
import * as firebase from 'firebase';
import { snapshotChanges } from '@angular/fire/database';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-detalle-sindicato-fundacion',
  templateUrl: './modal-detalle-sindicato-fundacion.component.html',
  styleUrls: ['./modal-detalle-sindicato-fundacion.component.css']
})
export class ModalDetalleSindicatoFundacionComponent implements OnInit {
  dataSource:any;
  userId:any;
  isLoading=true;
  displayedColumns: string[] = [
    'nombre', 'correo'
  ];
  miembrosList:any[] =[];
  miembrosExists:boolean;
  constructor(public db: AngularFirestore,@Inject(MAT_DIALOG_DATA) public idSindicato: any,private fundSvc:FundacionService,public dialogRef: MatDialogRef<ModalInfoReunionComponent>,
  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    console.log("id sindicato:", this.idSindicato)
    this.getMiembros();
  }

  getMiembros (){

    this.db.collection("Sindicato").doc(this.idSindicato).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.exists){

        snapshotChanges.data().usuarios.forEach(element => {

          var miembro = {
            nombre:element.nombre,
            correo:element.correo,

          }

          this.miembrosList.push(miembro);
          
        });
        console.log("miembros: ",this.miembrosExists);
        if(this.miembrosList.length > 0){
          this.miembrosExists = true;

        }
        else{
          this.miembrosExists = false;
        }
        this.isLoading=false;
        this.dataSource =  new MatTableDataSource<any>(this.miembrosList);

      }
    })

  }

}
