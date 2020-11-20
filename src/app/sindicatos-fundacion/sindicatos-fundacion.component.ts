import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Sindicato } from '../shared/Interfaces/Sindicato';
import { MatTableDataSource } from '@angular/material/table';
import { Reunion } from '../shared/Interfaces/Reunion';
import { CrearFundacionComponent } from '../crear-fundacion/crear-fundacion.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalCrearSindicatoFundacionComponent } from '../modal-crear-sindicato-fundacion/modal-crear-sindicato-fundacion.component';
import { ModalAsociarAbogadoComponent } from '../modal-asociar-abogado/modal-asociar-abogado.component';
import { VerAbogadosSindicatoComponent } from '../ver-abogados-sindicato/ver-abogados-sindicato.component';
import { snapshotChanges } from '@angular/fire/database';
import { ModalDetalleSindicatoFundacionComponent } from '../modal-detalle-sindicato-fundacion/modal-detalle-sindicato-fundacion.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-sindicatos-fundacion',
  templateUrl: './sindicatos-fundacion.component.html',
  styleUrls: ['./sindicatos-fundacion.component.css']
})
export class SindicatosFundacionComponent implements OnInit {

  constructor(public db: AngularFirestore,private dialog: MatDialog) { }
  dataSource: any;
  displayedColumns: string[] = [
    'Nombre', 'Admin','Correo_admin', 'Miembros','Detalles','Abogado','verAbogado','deshabilitar'
  ];
  userId:any;
  cantidadMiembros:any;
  sindicatos: any [];
  sindicatosExists:boolean;
  isLoading=true;
  haveFundacion:boolean;
  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    
    this.tieneFundacion();
    this.getSindicatos();
    
  }

  tieneFundacion(){

    this.db.collection("Fundacion").doc(this.userId).get().subscribe((snapshotChanges)=>{
      if(snapshotChanges.exists)
      {
        this.haveFundacion = true;
      }
      else{
        this.haveFundacion =false;
      }

      console.log("tiene fundacion?: ",this.haveFundacion)
    })

  }

  addLawyer(element){
    
    var idSindicato = element.idSindicato;
    console.log("id sindicato: ",idSindicato)

    const dialogRef = this.dialog.open(ModalAsociarAbogadoComponent, {
      width: '800px',
      data:idSindicato
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  verDetalle(elm){

    const dialogRef = this.dialog.open(ModalDetalleSindicatoFundacionComponent, {
      width: '800px',
      data:elm.idSindicato
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
   
    });
  }

  crearSindicato(){
    const dialogRef = this.dialog.open(ModalCrearSindicatoFundacionComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.sindicatos = [];
      this.getSindicatos();
    });
  }

  getSindicatos(){
    this.isLoading =true;
    this.sindicatos = [];
    this.db.collection("Sindicato").get().subscribe((querySnapshot)=>{

      querySnapshot.forEach((doc)=> {

        if(doc.data().idFundacion == this.userId){

          var sindicatoData = doc.data();
          var nombreAdmin:string;
          var correoAdmin:string;
          for(let i =0;i< sindicatoData.usuarios.length;i++){

            if (sindicatoData.usuarios[i].id == sindicatoData.idAdmin){

              nombreAdmin = sindicatoData.usuarios[i].nombre;
              correoAdmin = sindicatoData.usuarios[i].correo;
            }

          }
          console.log("Nombre del admin: ",nombreAdmin)
          var sindicato = {
            nombre:sindicatoData.nombreSindicato,
            admin:nombreAdmin,
            usuarios:sindicatoData.usuarios,
            correoAdmin:correoAdmin,
            idFundacion:sindicatoData.idFundacion,
            cantidadMiembros:sindicatoData.usuarios.length,
            idSindicato:sindicatoData.idAdmin
          }

         this.sindicatos.push(sindicato);
        
         this.dataSource = new MatTableDataSource<any>(this.sindicatos);

         

        }
       
        

      });
    });

    
    setTimeout(()=>{
      
      if(this.sindicatos.length >0){
        this.sindicatosExists =true;
       
      }
      else{
        this.sindicatosExists = false;
        console.log("existe sindicato?: ",this.sindicatosExists)
      }
      this.isLoading=false;
    },1000)
  }


  verAbogados(element){
    const dialogRef = this.dialog.open(VerAbogadosSindicatoComponent, {
      width: '800px',
      data:element.idSindicato
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.sindicatos = [];
      this.getSindicatos();
    });
  }
  deshabilitarSindicato(elm){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Está seguro que quiere deshabilitar este sindicato?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });

    console.log("elemento: ", elm)
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("elemento a borrar: ", elm)
        

      }
    });
  }

}
