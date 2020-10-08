import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snapshotChanges } from '@angular/fire/database';

@Component({
  selector: 'app-agregar-usuario-sindicato',
  templateUrl: './agregar-usuario-sindicato.component.html',
  styleUrls: ['./agregar-usuario-sindicato.component.css']
})
export class AgregarUsuarioSindicatoComponent implements OnInit {
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
  constructor(private authSvc: AuthService, public dialogRef: MatDialogRef<AgregarUsuarioSindicatoComponent>, public db: AngularFirestore, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;

    this.db.collection('InactiveUsers').valueChanges()
      .subscribe(result => {
        console.log(result.length);

        if (result.length == 0) {
          this.inactiveExists = false;
        }
        else {
          this.inactiveExists = true;
        }
      })
    setTimeout(() => {
      console.log("hay inactivos?: ", this.inactiveExists)
    }, 1500)

  }

  onAddUser() {



    this.db.collection("users").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        var user = doc.data();
        console.log("emailform ", this.emailFormControl.value)
        console.log("email firebase:", user.email)
        if (user.email == this.emailFormControl.value) {

          this.emailExists = true;
        }
        else {
          this.emailExists = false;
        }

      })



    })

    console.log("existe el email?: ", this.emailExists)
    setTimeout(() => {
      if (this.emailExists == false) {
        this.authSvc.addNewInactiveUser(this.nameFormControl.value, this.emailFormControl.value, this.passwordFormControl.value, this.userId, "Sindicato");
        this.snackbar.open("Usuario pendiente agregado exitosamente, esperando la activación de la cuenta", '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.dialogRef.close({
        });
      }
      else {

        this.snackbar.open("No se pudo crear sindicato, el correo ingresado ya se encuentra registrado", '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    },1000)


  }

}
