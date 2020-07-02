import { Injectable } from '@angular/core';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {first} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore ,AngularFirestoreDocument} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {IUser} from './User';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component,Inject} from '@angular/core';

@Injectable()
export class AuthService {

  public user:User;
  private eventAuthError = new BehaviorSubject<String>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  userData :any
  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public router: Router,
    public dialog : MatDialog) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
     }


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
  return this.afAuth.createUserWithEmailAndPassword(email, password)
  .then((result) => {
    /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

    this.SetUserData(result.user);
    this.dialog.open(DialogDataExampleDialog, {});
    this.router.navigate(['/login']);
  }).catch((error) => {
    window.alert(error.message)

  })
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

    return this.afAuth.sendPasswordResetEmail( email);

    }


    SetUserData(user) {
      const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
      const userData: IUser = {
        uid: user.uid,
        email: user.email
      }
      return userRef.set(userData, {
        merge: true
      })
    }

}
@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: './Dialog.component.html',
})
export class DialogDataExampleDialog {
  constructor() {}
}
export interface DialogData {
  animal: "Se ha creado la cuenta correctamente";
}
