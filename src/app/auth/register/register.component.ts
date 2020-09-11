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
  isLoading = false;
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
  hide =true;
  authError: any;
  organizations = [
    {org: "Sindicato"},
    {org: "Fundación"}
  ];
  selectedOrganization = this.organizations[0];
  constructor(private authSvc:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authSvc.eventAuthError$.subscribe(data =>{
      this.authError = data;
    });
  }

  onRegister(){
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    const name = this.nameFormControl.value;
    const organization = this.selectedOrganization.org;
    this.isLoading = true;
    try{

      const user =  this.authSvc.register(email,password,name,organization);
      
      if(user){
        console.log("email control form:  ",this.authSvc.eventAuthError$);
        //this.router.navigate(["/home"]);
        this.isLoading = false;
      }
      this.router.navigate(['/login']);
    }
    catch(error){
      console.log(error);
      this.isLoading= false;
    }


  }

  get passwordInput(){

    return this.passwordFormControl.get('password');

  }


}
