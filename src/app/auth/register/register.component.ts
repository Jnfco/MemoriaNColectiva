import { Component, OnInit } from '@angular/core';
import{FormGroup,FormControl,Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  matcher = new ErrorStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.min(7),
  ]);
  hide =true;
  authError: any;
  constructor(private authSvc:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authSvc.eventAuthError$.subscribe(data =>{
      this.authError = data;
    });
  }

  onRegister(){
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;

    try{

      const user =  this.authSvc.register(email,password);

      if(user){
        console.log("email control form:  ",this.authSvc.eventAuthError$);
        //this.router.navigate(["/home"]);
      }
    }
    catch(error){
      console.log(error);
    }


  }

  get passwordInput(){

    return this.passwordFormControl.get('password');

  }
}
