import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private authSvc: AuthService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.authSvc.eventAuthError$.subscribe(data => {
      this.authError = data;
    });
  }

  onReset() {

    if (this.emailFormControl.valid) {

      const email = this.emailFormControl.value;
      this.authSvc.resetPasswordInit(email)
        .then((result) => {
          /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */

          this.snackbar.open("Se ha enviado un correo con el enlace para recuperar la contraseña", '', {
            duration: 3000,
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/login'])

        })
        .catch((error) => {
          this.snackbar.open("Correo ingresado no existe", '', {
            duration: 3000,
            verticalPosition: 'bottom'
          });
        });



    }
  }
}




