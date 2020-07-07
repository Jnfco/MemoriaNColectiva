import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators,FormGroup} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.css']
})
export class RecuperarPassComponent implements OnInit {
  matcher = new ErrorStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  authError: any;

  constructor(private authSvc: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.authSvc.eventAuthError$.subscribe(data =>{
      this.authError = data;
    });
  }

  onReset(){

        if(this.emailFormControl.valid){

          const email = this.emailFormControl.value;
      this.authSvc.resetPasswordInit(email)
      .then(
        () =>
        {
          alert("Se ha enviado un correo con el enlace para recuperar tu contraseña")
        this.router.navigate(['/login'])},
        () => alert("ha ocurrido un problema, correo vacío o incorrecto"),
        );
        }
  }
}




