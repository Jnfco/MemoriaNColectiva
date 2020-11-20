import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { EventService } from '../services/event.service';
import { EventoFundacion, EventoSindicato } from '../shared/Interfaces/Evento';

@Component({
  selector: 'app-modal-agregar-evento-fundacion',
  templateUrl: './modal-agregar-evento-fundacion.component.html',
  styleUrls: ['./modal-agregar-evento-fundacion.component.css']
})
export class ModalAgregarEventoFundacionComponent implements OnInit {

  //Lista de sindicatos asociados
  public sindicatoList: any[] = [];

  //Sindicato seleccionado
  public selectedSindicato: string;

  sindicatosAsociados: string[] = [];

  public sindicatoSelected = false;
  idSindicatoUser: string;
  isAdmin: boolean;

  public userId: string;
  public userEmail: string;

  //FormControls

  tituloFormControl = new FormControl('', [
    Validators.required,
  ]);
  descripcionFormControl = new FormControl('', [

  ])

  fechaFormControl = new FormControl('', [
    Validators.required
  ])

  //Validadores
  fechaCorrecta: boolean;

  idFundacion: string;

  constructor(public db: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data: any, private eventSvc: EventService, public dialogRef: MatDialogRef<ModalAgregarEventoFundacionComponent>) { }

  ngOnInit(): void {

    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
    this.cargarSindicatos();
    setTimeout(() => {
      this.getIdFundacion(this.userEmail);
    }, 1000)
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

                  console.log("ids de sindicatos asociados: ", this.sindicatoList)

                })

              }, 1000);


            }

          });
        }


      });


    });
  }

  getIdFundacion(emailAbogado: string) {

    this.db.collection("Fundacion").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {


        doc.data().usuarios.forEach(element => {
          console.log("email sesion: ", emailAbogado);
          console.log("email bd: ", element.correo)
          if (emailAbogado == element.correo) {
            console.log("fundacion encontrada!!!");
            this.idFundacion = doc.data().idAdmin;
            console.log("id fundacion: ", this.idFundacion);

          }

        });
      })
    })

  }

  selectSindicato() {

    var sindicatoSeleccionado = this.selectedSindicato;
    console.log("valor seleccionado: ", sindicatoSeleccionado);
    this.idSindicatoUser = sindicatoSeleccionado;

    //this.getDocumentInfo();
    this.sindicatoSelected = true;

  }

  onAgregarEvento() {


    const momentDate = new Date(this.fechaFormControl.value);
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");
    console.log("formated date: ", formattedDate);
    var fecha = new Date(this.fechaFormControl.value);
    var fechaHoy = new Date(Date.now());
    var fechaHoyFormatted = moment(fechaHoy).format("YYYY-MM-DD");
    console.log("fecha hoy: ", fechaHoyFormatted)

    if (fechaHoyFormatted > formattedDate) {

      this.fechaCorrecta = false;
      console.log("La fecha ingresada ya pasó")

    }
    else {
      this.fechaCorrecta = true;
    }
    var uuid = require("uuid");
    const id = uuid.v4();

    var evento = {
      nombre: this.tituloFormControl.value,
      descripcion: this.descripcionFormControl.value,
      fecha: formattedDate,
      idSindicato: this.idSindicatoUser,
      idFundacion: this.idFundacion
    }

    this.eventSvc.agregarEventoFundacion(evento, id);
    this.dialogRef.close()

  }

  onCerrar() {
    this.dialogRef.close();
  }


}
