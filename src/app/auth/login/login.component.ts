import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Form } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  isLoading = false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.min(7),
  ]);
  matcher = new ErrorStateMatcher();

  authError: any;
  sindicatoHabilitado:boolean;
  constructor(private authSvc: AuthService, private router: Router, public db: AngularFirestore,private snackbar: MatSnackBar) { }
  hide = true;
  ngOnInit() {
    this.authSvc.eventAuthError$.subscribe(data => {
      this.authError = data;
    });
  }

  onLogin() {
    this.sindicatoHabilitado = true;

    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
   

    //Primero se verifica si pertenece a un sindicato habilitado

    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        if (doc.data().sindicatoEnabled == false) {
          doc.data().usuarios.forEach(element => {

            if (element.correo == email) {
                this.sindicatoHabilitado = false;

            }

          });
        }


      });
    });

    setTimeout(()=>{
      if(this.sindicatoHabilitado == true){
        this.authSvc.login(email, password);
        
      }
      else{
          this.snackbar.open("Esta cuenta pertenece a un sindicato deshabilitado, por lo tanto no se permite su ingreso al sistema", '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
    
      }

    },1000)
    

  }


}
