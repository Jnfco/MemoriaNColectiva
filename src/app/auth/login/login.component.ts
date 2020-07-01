import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Form } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import {FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  matcher = new ErrorStateMatcher();

  authError: any;
  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(){
    this.authSvc.eventAuthError$.subscribe(data =>{
      this.authError = data;
    });
  }

  onLogin() {
    /*
    const { email, password } = this.loginForm.value;
    const user = this.authSvc.login(email, password);
    if (user) {
      redireccionar a inicio
      this.router.navigate(['/home']);
    }*/

    const {email,password} = this.loginForm.value;
    this.authSvc.login(email,password);

  }

  resetPassword() {
    const {email,password} = this.loginForm.value;
    if (!email) {
      alert('Escribe el correo primero');
    }
    this.authSvc.resetPasswordInit(email)
    .then(
      () => alert("Un enlace para reestablecer tu contraseña se ha enviado a tu email"),
      (rejectionReason) => alert(rejectionReason))
    .catch(e => alert('Ha ocurrido un error al intentar reestablecer tu contraseña'));
  }
}
