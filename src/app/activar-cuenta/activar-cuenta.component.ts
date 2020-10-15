import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activar-cuenta',
  templateUrl: './activar-cuenta.component.html',
  styleUrls: ['./activar-cuenta.component.css']
})
export class ActivarCuentaComponent implements OnInit {

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

  onActivate(){
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    const name = this.nameFormControl.value;
    const organization = this.selectedOrganization.org;
    const isAdmin = true;
    this.isLoading = true;
    try{

      
     //this.authSvc.activateAccount(email,password);
     console.log("aaaaa")
      this.authSvc.activation(email,password);
      
      //this.router.navigate(['/login']);
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
