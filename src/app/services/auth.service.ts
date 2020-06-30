import { Injectable } from '@angular/core';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {first} from 'rxjs/operators';


@Injectable()
export class AuthService {

  public user:User;

  constructor(public afAuth: AngularFireAuth) { }

  login(email:string,password:string){
    try{
      console.log("Valores de inicio de sesion: ",email,password);
      const result = this.afAuth.signInWithEmailAndPassword(
        email,
        password
        );
        return result;
    }
    catch(error){
      console.log(error);

    }

  }

 register(email: string,password: string){
    try{
      const result = this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return result;
    }
    catch(error){
    console.log(error);

    }

  }

  logout(){
    try{
       this.afAuth.signOut();
    }
    catch(error){
      console.log(error);

    }

  }
  getCurrentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }
}
