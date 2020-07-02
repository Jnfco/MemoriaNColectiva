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

    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    this.authSvc.login(email,password);

  }


}
