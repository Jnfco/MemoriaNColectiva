import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AgregarUsuarioSindicatoComponent } from '../agregar-usuario-sindicato/agregar-usuario-sindicato.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { FundacionService } from '../services/fundacion.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-modal-crear-sindicato-fundacion',
  templateUrl: './modal-crear-sindicato-fundacion.component.html',
  styleUrls: ['./modal-crear-sindicato-fundacion.component.css']
})
export class ModalCrearSindicatoFundacionComponent implements OnInit {

  matcher = new ErrorStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.min(7),
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.max(100),
  ]);
  hide
  userId: any;
  emailExists: boolean;
  inactiveExists: boolean;
  isAsignarAbogado: boolean;
  isAdmin: boolean;
  isInSindicato: boolean;

  //Nuevos booleanos
  existEmail: boolean;
  emailInSindicato: boolean;
  esSindicato: boolean;

  estaEnSindicato: boolean;
  listaCorreosAdmins: string[] = [];
  listaCorreosValidos: any[] = [];
  listaSindicatos: string[] = [];
  public selectedAdmin: string;
  public adminSelected: boolean = false;
  constructor(private authSvc: AuthService, private fundSvc: FundacionService, public dialogRef: MatDialogRef<ModalCrearSindicatoFundacionComponent>, public db: AngularFirestore, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.cargarEmailsValidos();


  }

  asignarAbogado() {

    this.inactiveExists = true;
  }

  onAddSindicato() {


    this.db.collection("users").get().subscribe((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        if(this.selectedAdmin == doc.data().email){

          var user = doc.data();
          var admin = {
            nombre: user.name,
            correo: user.email,
            id: user.uid,
            organization: user.organization,
          }

          this.fundSvc.createSindicatoFundacion(this.nameFormControl.value, admin, this.userId);
          this.dialogRef.close({
          });
        }
      })
    })


   


  }
  cargarEmailsValidos() {
    //Buscar emails para agregarlo a la lista
    this.db.collection("users").get().subscribe((querySnapshot) => {


      querySnapshot.forEach((doc) => {

        if (doc.data().isAdmin == true && doc.data().organization == "Sindicato") {

          this.listaCorreosAdmins.push(doc.data().email);
        }
      });
    });

    //Agregar los sindicatos a una lista aparte

    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        doc.data().usuarios.forEach(element => {
          this.listaSindicatos.push(element.correo);
        });

        doc.data().abogados.forEach(element => {
          this.listaSindicatos.push(element.correo);
        });



      });

    });

    setTimeout(() => {
      console.log("lista de sindicatos en el sistema: ", this.listaSindicatos)

      for (let i = 0; i < this.listaCorreosAdmins.length; i++) {
        this.estaEnSindicato = false;
        console.log("a revisar el correo: ", this.listaCorreosAdmins[i])
        console.log("cantidad de usuarios: ", this.listaSindicatos.length)
        for (let j = 0; j < this.listaSindicatos.length; j++) {
          console.log("entramos a comparar con el correo: ", this.listaSindicatos[j])

          if (this.listaCorreosAdmins[i] == this.listaSindicatos[j]) {
            console.log("Los correos: " + this.listaCorreosAdmins[i] + "Y " + this.listaSindicatos[j] + " son iguales")
            this.estaEnSindicato = true;

          }

        }
        if (this.estaEnSindicato == false) {
          var admin = {
            correo: this.listaCorreosAdmins[i]
          }
          this.listaCorreosValidos.push(admin)
        }

      }
      console.log("correos validos: ", this.listaCorreosValidos)
    }, 1000)
  }
  selectAdmin() {

    var adminSeleccionado = this.selectedAdmin;
    console.log("valor seleccionado: ", adminSeleccionado);


    //this.getDocumentInfo();
    this.adminSelected = true;

  }



}
