import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AgregarUsuarioSindicatoComponent } from '../agregar-usuario-sindicato/agregar-usuario-sindicato.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';

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
  inactiveExists:boolean;
  isAsignarAbogado:boolean;
  constructor(private authSvc: AuthService, public dialogRef: MatDialogRef<ModalCrearSindicatoFundacionComponent>, public db: AngularFirestore,private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;


  }

  asignarAbogado(){
    
    this.inactiveExists = true;
  }

  onAddSindicato() {


    


    this.dialogRef.close({
    });



  }
}
