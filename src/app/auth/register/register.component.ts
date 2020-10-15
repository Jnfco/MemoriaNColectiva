import { Component, OnInit } from '@angular/core';
import{FormGroup,FormControl,Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FundacionService } from 'src/app/services/fundacion.service';

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
  fundacionFormControl = new FormControl('', [
    Validators.required,
    Validators.max(100),
  ]);
  hide =true;
  authError: any;
  organizations = [
    {org: "Sindicato"},
    {org: "Fundación"}
  ];
  fundacion = "Fundación";
  sindicato = "Sindicato";
  isFundacion:boolean;
  selectedOrganization = this.organizations[0];
  org = 'Sindicato';
  userId:any;
  user:any;
  constructor(private authSvc:AuthService,private router:Router,public db:AngularFirestore,private fundSvc:FundacionService) { }

  ngOnInit(): void {
    this.authSvc.eventAuthError$.subscribe(data =>{
      this.authError = data;
    });

    //this.userId = firebase.auth().currentUser.uid;
  }

  print(){
    console.log("org: ", this.org)
  }

  onRegister(){
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    const name = this.nameFormControl.value;
    const organization = this.org;
    const isAdmin = true;
    this.isLoading = true;
    try{

      
      this.user =  this.authSvc.register(email,password,name,organization,isAdmin);
      if(this.user){
        console.log("email control form:  ",this.authSvc.eventAuthError$);
        this.isLoading = false;
      }
      
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
