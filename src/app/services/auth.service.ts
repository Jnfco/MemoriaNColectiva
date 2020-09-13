import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { first, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IUser } from './User';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatSnackBar} from '@angular/material/snack-bar';
import { snapshotChanges } from '@angular/fire/database';

@Injectable()
export class AuthService implements CanActivate {
  public user: User;
  private eventAuthError = new BehaviorSubject<String>('');
  private userID:any;
  eventAuthError$ = this.eventAuthError.asObservable();
  userData: any;
  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }
  canActivate(): Observable <boolean>  {
    return this.afAuth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if(!loggedIn){
          console.log('accesso denegado!!');
          this.router.navigate(['/login']);
        }
      })
    )
  }

  getUserState() {
    return this.afAuth.authState;
  }
  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.eventAuthError.next(error);
      })
      .then((userCredential) => {
        if (userCredential) {
          this.router.navigate(['/home']);
        }
      });

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

  register(email: string, password: string,name: string,organization: string,isAdmin:boolean) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.SetUserData(result.user,name,organization,isAdmin);
        this.snackbar.open("Datos guardados exitosamente!",'',{
          duration: 3000,
          verticalPosition:'bottom'
        });
      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          window.alert("Este correo está asociado a una cuenta ya existente!");
        }
      });
  }

  logout() {
    return this.afAuth.signOut();
  }
  getCurrentUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  /**
   * Initiate the password reset process for this user
   * @param email email of the user
   */
  resetPasswordInit(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  SetUserData(user, name:string,organization:string,isAdmin:boolean) {

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      name: name,
      organization: organization,
      isAdmin:isAdmin
    };
    this.userID=user.uid;
    return userRef.set(userData, {
      merge: true,
    });
  }


  isAdmin(userId:string):boolean{
console.log('entró en el metodo isadmin de service')
    this.db.collection('users').doc(userId).get().subscribe((snapshotChanges)=>{
      if(snapshotChanges.exists){
        var doc = snapshotChanges.data();
        var isAdmin = doc.isAdmin;
        console.log ('es admin en el service?: ',isAdmin)
        if(isAdmin == true){
          return true;
        }
        else if(isAdmin == false){
          return false;
        }
      }
    })


    return true;
  }




}


