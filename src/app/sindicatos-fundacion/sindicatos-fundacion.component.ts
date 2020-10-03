import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Sindicato } from '../shared/Interfaces/Sindicato';
import { MatTableDataSource } from '@angular/material/table';
import { Reunion } from '../shared/Interfaces/Reunion';
import { CrearFundacionComponent } from '../crear-fundacion/crear-fundacion.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalCrearSindicatoFundacionComponent } from '../modal-crear-sindicato-fundacion/modal-crear-sindicato-fundacion.component';

@Component({
  selector: 'app-sindicatos-fundacion',
  templateUrl: './sindicatos-fundacion.component.html',
  styleUrls: ['./sindicatos-fundacion.component.css']
})
export class SindicatosFundacionComponent implements OnInit {

  constructor(public db: AngularFirestore,private dialog: MatDialog) { }
  dataSource: any;
  displayedColumns: string[] = [
    'Nombre', 'Admin','Correo_admin', 'Miembros','Detalles'
  ];
  userId:any;
  cantidadMiembros:any;
  sindicatos: any [];
  sindicatosExists:boolean;
  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.getSindicatos();
    
  }


  verDetalle(elm){

    this.db.collection("Reunion").get().subscribe((querySnapshot)=>{

      querySnapshot.forEach((doc)=> {



      });
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
            cantidadMiembros:sindicatoData.usuarios.length
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
    },1000)
  }
}
