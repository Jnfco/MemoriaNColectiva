import { Injectable } from '@angular/core';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {first} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {

  public user:User;
  private eventAuthError = new BehaviorSubject<String>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public router: Router) { }


    getUserState(){
      return this.afAuth.authState;
    }
  login(email:string,password:string){

    this.afAuth.signInWithEmailAndPassword(
      email,
      password
    ).catch(error => {
      this.eventAuthError.next(error);
    })
    .then(userCredential => {
      if (userCredential){
        this.router.navigate(['/home']);
      }
    })

    /*
      console.log("Valores de inicio de sesion: ",email,password);
      const result = this.afAuth.signInWithEmailAndPassword(
        email,
        password
        );
        return result;*/

      /*
     const result = this.afAuth.signInWithEmailAndPassword(
        email,
        password
      )
      .catch(error => {
        this.eventAuthError.next(error);
      });
    return result;*/
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
    return this.afAuth.signOut();

  }
  getCurrentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  /**
   * Initiate the password reset process for this user
   * @param email email of the user
   */
  resetPasswordInit(email: string) {
    return this.afAuth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' });
    }
}
