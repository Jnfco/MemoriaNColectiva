import { Component, OnInit } from '@angular/core';
import { Reunion } from '../shared/Interfaces/Reunion';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleReunionComponent } from '../detalle-reunion/detalle-reunion.component';
import { snapshotChanges } from '@angular/fire/database';
import { VerDocHistorialComponent } from '../ver-doc-historial/ver-doc-historial.component';

@Component({
  selector: 'app-historial-fundacion',
  templateUrl: './historial-fundacion.component.html',
  styleUrls: ['./historial-fundacion.component.css']
})
export class HistorialFundacionComponent implements OnInit {

  displayedColumns: string[] = [
    'Titulo', 'Fecha', 'Detalles'
  ];
  dataSource: any;
  reuniones: Reunion[];
  tieneReuniones = true;
  isLoading: boolean;
  constructor(public dialog: MatDialog, public db: AngularFirestore, public dialog2: MatDialog) {

    this.tieneReuniones = false;
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;

    this.reuniones = [];

  }
  userId: any;
  idSindicatoUser: any;
  userEmail: any;
  selectedValue: string;
  sindicatoExists = false;
  sindicatoList: any[] = [];
  sindicatosAsociados: string[] = [];
  historialExists = true;
  sindicatoSelected = false;
  isAdmin: boolean;
  //Para el historial general
  historialDocList: any[] = [];

  ngOnInit(): void {

    this.sindicatoExists = false;
    this.historialExists = true;
    console.log("reuniones agregar: ", this.reuniones)

    console.log("data: ", this.dataSource)
    //this.historialExists = false;
    this.checkAdmin();
    this.cargarSindicatos();

    console.log("historial exists: ", this.historialExists)
  }



  checkAdmin() {


    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

      this.isAdmin = snapshotChanges.data().isAdmin;

    })

  }

  getMeetingAdmin() {
    this.isLoading = true;
    this.reuniones = [];

    console.log("id sindicato: ", this.idSindicatoUser)

    this.db.collection("Reunion").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {


        if (doc.data().idSindicato == this.idSindicatoUser && doc.data().started == true) {
          console.log("doc: ", doc.data());
          var reunion: Reunion = {
            idReunion: doc.data().idReunion,
            idCreador: doc.data().idCreador,
            titulo: doc.data().titulo,
            descripcion: doc.data().descripcion,
            fecha: doc.data().fecha,
            horaInicio: doc.data().horaInicio,
            horaTermino: doc.data().horaTermino,
            email: doc.data().email,
            idSindicato: doc.data().idSindicato,
            started: doc.data().started,
            idAbogado: doc.data().idAbogado,
            idFundacion: doc.data().idFundacion
          }
          this.reuniones.push(reunion);


          console.log('Reuniones ', this.reuniones)

          this.tieneReuniones = true;

        }


      })
      this.dataSource = new MatTableDataSource<Reunion>(this.reuniones);

      if (this.reuniones.length == 0) {
        this.tieneReuniones = false;

      }
      else {
        this.tieneReuniones = true;
        this.tieneReuniones = true;
      }
      this.isLoading = false;

    })

  }

  getMeeting() {

    this.isLoading = true;
    this.reuniones = [];

    

    this.db.collection("Reunion").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {


        if (doc.data().idSindicato == this.idSindicatoUser && doc.data().started == true && doc.data().idAbogado == this.userId) {
          console.log("doc: ", doc.data());
          var reunion: Reunion = {
            idReunion: doc.data().idReunion,
            idCreador: doc.data().idCreador,
            titulo: doc.data().titulo,
            descripcion: doc.data().descripcion,
            fecha: doc.data().fecha,
            horaInicio: doc.data().horaInicio,
            horaTermino: doc.data().horaTermino,
            email: doc.data().email,
            idSindicato: doc.data().idSindicato,
            started: doc.data().started,
            idAbogado: doc.data().idAbogado,
            idFundacion: doc.data().idFundacion
          }
          this.reuniones.push(reunion);


          console.log('Reuniones ', this.reuniones)

          this.tieneReuniones = true;

        }


      })
      this.dataSource = new MatTableDataSource<Reunion>(this.reuniones);

      if (this.reuniones.length == 0) {
        this.tieneReuniones = false;

      }
      else {
        this.tieneReuniones = true;
        this.tieneReuniones = true;
      }
      this.isLoading = false;

    })


  }

  getHistorialDoc() {
    this.historialDocList = [];

    this.db.collection("Historial").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        if (doc.data().idSindicato == this.idSindicatoUser) {

          var historial = {
            nombre: doc.data().nombre,
            correo: doc.data().correo,
            fecha: doc.data().fecha,
            idCambio: doc.data().idCambio
          }
          console.log("historial: ", historial)
          this.historialDocList.push(historial);

        }
      })
    })

  }
  cargarSindicatos() {

    //Primero se buscan todos los sindicatos que están asociados al abogado actual en la sesión
    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        if (doc.data().sindicatoEnabled == true) {
          doc.data().abogados.forEach(element => {

            if (element.correo == this.userEmail) {

              setTimeout(() => {
                this.db.collection("users").doc(doc.data().idAdmin).get().subscribe((snapshotChanges) => {

                  var sindicato: any = {
                    nombre: doc.data().nombreSindicato,
                    cantidadMiembros: doc.data().usuarios.length,
                    usuarios: doc.data().usuarios,
                    nombreAdmin: snapshotChanges.data().name,
                    correoAdmin: snapshotChanges.data().email,
                    idFundacion: doc.data().idFundacion,
                    idAdmin: doc.data().idAdmin
                  }

                  //Luego de encontrar los sindicatos, se llenan en la lista 
                  this.sindicatoList.push(sindicato);
                  console.log("sindicatos encontrados: ", this.sindicatoList)
                  console.log("ids de sindicatos asociados: ", this.sindicatoList)


                })

              }, 1000);


            }

          });
        }


      });


    });
  }
  selectSindicato() {
    this.sindicatoSelected = true;
    this.sindicatoExists = true;
    var sindicatoSeleccionado = this.selectedValue;
    console.log("valor seleccionado: ", sindicatoSeleccionado);
    this.idSindicatoUser = sindicatoSeleccionado;

    if (this.isAdmin == true) {

      this.getMeetingAdmin()
    }
    else {
      this.getMeeting();

    }
    //this.getDocument();

    setTimeout(() => {

      this.getHistorialDoc();
    }, 1000)

  }

  verContrato(elm) {

    console.log("elm", elm)
    const dialogRef = this.dialog2.open(VerDocHistorialComponent, {
      width: '800px',
      data: elm.idCambio
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

    });

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
        nombreAbogado: nombreAbogado,
        correoAbogado: correoAbogado

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
