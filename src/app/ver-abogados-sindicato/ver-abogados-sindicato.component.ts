import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FundacionService } from '../services/fundacion.service';
import { ModalInfoReunionComponent } from '../reunion/modal-info-reunion/modal-info-reunion.component';
import * as firebase from 'firebase';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ver-abogados-sindicato',
  templateUrl: './ver-abogados-sindicato.component.html',
  styleUrls: ['./ver-abogados-sindicato.component.css']
})
export class VerAbogadosSindicatoComponent implements OnInit {

  dataSource:any;
  userId:any;
  listaAbogados:any[]=[];
  abogadosExists:boolean;
  isLoading=true;
  displayedColumns: string[] = [
    'nombre', 'correo','eliminar'
  ];
  constructor(public db: AngularFirestore,@Inject(MAT_DIALOG_DATA) public idSindicato: any,private fundSvc:FundacionService,public dialogRef: MatDialogRef<ModalInfoReunionComponent>) { }

  ngOnInit(): void {


    this.userId = firebase.auth().currentUser.uid;
    this.db.collection("Sindicato").doc(this.idSindicato).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.exists){
        snapshotChanges.data().abogados.forEach(element => {

          var abogado ={
            nombre:element.nombre,
            correo:element.correo
          }

          this.listaAbogados.push(abogado);
          
        });
        if(this.listaAbogados.length >0){
          this.abogadosExists =true;
        }
        else{
          this.abogadosExists =false;
        }
        this.dataSource = new MatTableDataSource<any>(this.listaAbogados);
        this.isLoading=false;
        console.log("abogados asociados: ",this.listaAbogados);
      }
    })


  }

}
