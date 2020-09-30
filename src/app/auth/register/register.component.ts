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
    const organization = this.selectedOrganization.org;
    const isAdmin = true;
    this.isLoading = true;
    //const idFundacion = this.userId;
    try{

      //const user =  this.authSvc.register(email,password,name,organization,isAdmin);

      
      if (this.org == "Fundación"){
        console.log("org: ",this.org)
        var adminFundacion = {
          nombre:name,
          correo:email,
          pass:password
        }


    var uuid = require("uuid");
    var id = uuid.v4();
      //this.user = this.authSvc.registerWithFundationAdmin(email,password,name,organization,true,this.fundacionFormControl.value)
      this.authSvc.addInactiveAdmin(name, email, password,id);

      }
      else{
       this.user =  this.authSvc.register(email,password,name,organization,isAdmin);
      }
      
      if(this.user){
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
