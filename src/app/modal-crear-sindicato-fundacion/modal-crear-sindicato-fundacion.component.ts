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
  constructor(private authSvc: AuthService, private fundSvc: FundacionService, public dialogRef: MatDialogRef<ModalCrearSindicatoFundacionComponent>, public db: AngularFirestore, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;



  }

  asignarAbogado() {

    this.inactiveExists = true;
  }

  onAddSindicato() {

    this.isInSindicato = false;
    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        for (let i = 0; i < doc.data().usuarios.length; i++) {

          if (this.emailFormControl.value == doc.data().usuarios[i].correo) {
            this.isInSindicato = true;
          }

        }
        this.snackbar.open("El correo ingresado ya pertenece a otro sindicato",'',{
          duration: 3000,
          verticalPosition:'bottom'
        });

      });
    });

    setTimeout(() => {
      this.db.collection("users").get().subscribe((querySnapshot) => {

        querySnapshot.forEach((doc) => {

          if (doc.data().email == this.emailFormControl.value) {
            console.log("El correo existe!")
            this.emailExists = true;
            if (doc.data().isAdmin == true) {
              console.log("El correo es de tipo admin");
              this.isAdmin = true;
              if (this.isInSindicato == false) {
                console.log("El correo no pertenece a ningun otro sindicato")
                var user = doc.data();
                console.log("uid del admin: ", user.uid)
                var admin = {
                  nombre: user.name,
                  correo: user.email,
                  id: user.uid,
                  organization: user.organization,
                }

                console.log("Admin a agregar a la fundacion")
                this.snackbar.open("Sindicato creado exitosamente!",'',{
                  duration: 3000,
                  verticalPosition:'bottom'
                });
                this.fundSvc.createSindicatoFundacion(this.nameFormControl.value, admin, this.userId);

                this.dialogRef.close({
                });
              }

            }
           
            else {
              this.snackbar.open("Correo ingresado no es de tipo administrador",'',{
                duration: 3000,
                verticalPosition:'bottom'
              });
              this.isAdmin = false;

            }

          }
          else {
           /* this.snackbar.open("El correo ingresado no existe",'',{
              duration: 3000,
              verticalPosition:'bottom'
            });*/
            this.emailExists = false;
          }

        })
      })
    }, 1000)








  }
}
