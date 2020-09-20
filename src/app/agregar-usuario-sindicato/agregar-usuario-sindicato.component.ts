import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { MatDialogRef } from '@angular/material/dialog';

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
  constructor(private authSvc: AuthService,public dialogRef: MatDialogRef<AgregarUsuarioSindicatoComponent>) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
  }

  onAddUser(){


    this.authSvc.addNewInactiveUser(this.nameFormControl.value,this.emailFormControl.value,this.passwordFormControl.value,this.userId);
    this.dialogRef.close({
    });
  }

}
