import { Component, OnInit } from '@angular/core';
import { Reunion } from '../shared/Interfaces/Reunion';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalReunionComponent } from '../reunion/modal-reunion/modal-reunion.component';
import { DetalleReunionComponent } from '../detalle-reunion/detalle-reunion.component';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

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
  isLoading = true;
  constructor(public dialog: MatDialog,public db: AngularFirestore) {

    this.tieneReuniones = false;
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;

    this.reuniones = [];
    this.getMeeting();
  }
  userId: any;
  idSindicatoUser:any;
  userEmail:any;
  ngOnInit(): void {
    
    console.log("reuniones agregar: ",this.reuniones)
    
    console.log("data: ", this.dataSource)
  }
  getMeeting(){

    

    this.db.collection('users').doc(this.userId).get().subscribe((snapshotChanges)=>{
              
      var usuario = snapshotChanges.data();
      console.log('aqui')
      this.idSindicatoUser = usuario.idSindicato;
      console.log('id sindicato encontrada: ',this.idSindicatoUser)
      console.log('es admin o no ?',usuario.isAdmin)
      if(usuario.isAdmin == true){
        this.idSindicatoUser =this.userId;

      }
      
    
    })

      this.db.collection("Reunion").get().subscribe((querySnapshot)=>{

        querySnapshot.forEach((doc)=> {


          if(doc.data().idSindicato == this.idSindicatoUser && doc.data().started == true)
          {
            var reunion:Reunion = {
              idReunion: doc.data().idReunion,
              idCreador: doc.data().idCreador,
              titulo: doc.data().titulo,
              descripcion: doc.data().descripcion,
              fecha: doc.data().fecha,
              horaInicio: doc.data().horaInicio,
              horaTermino: doc.data().horaTermino,
              email: doc.data().email,
              idSindicato:doc.data().idSindicato,
              started:doc.data().started,
              idAbogado:doc.data().idAbogado,
              idFundacion:doc.data().idFundacion
            }
            this.reuniones.push(reunion);

            
              console.log('Reuniones ',this.reuniones)
              this.dataSource = new MatTableDataSource<Reunion>(this.reuniones);
              this.tieneReuniones = true;
           
          }
        })


        this.isLoading = false;

      })

     

  }
  verDetalle(elm) {

    
    var nombreAbogado: string;
    var correoAbogado: string;
    this.db.collection("users").doc(elm.idAbogado).get().subscribe((snapshotChanges) => {

      var user = snapshotChanges.data();
      nombreAbogado = user.name;
      correoAbogado = user.email;


    })

    setTimeout(() => {
      var reunionSelect = {
        titulo: elm.titulo,
        descripcion: elm.descripcion,
        fecha: elm.fecha + "  " + elm.horaInicio + " - " + elm.horaTermino,
        idReunion: elm.idReunion,
        idSindicato: elm.idSindicato,
        nombreAbogado:nombreAbogado,
        correoAbogado:correoAbogado

      }
      
      console.log("reunion: ", reunionSelect)


      const dialogRef = this.dialog.open(DetalleReunionComponent, {
        width: '300px',
        data: reunionSelect
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        //const nowDate = new Date();
        //const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);
      });

    }, 1000)

  }
}
