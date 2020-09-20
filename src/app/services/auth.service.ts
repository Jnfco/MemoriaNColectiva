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
import { IUser, IUserSindicato } from './User';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snapshotChanges } from '@angular/fire/database';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { InactiveUser } from '../shared/Interfaces/InactiveUser';

@Injectable()
export class AuthService implements CanActivate {
  public user: User;
  private eventAuthError = new BehaviorSubject<String>('');
  private userID: any;
  eventAuthError$ = this.eventAuthError.asObservable();
  userData: any;
  idInactive:string;
  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    public fireservices: AngularFirestore
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
  canActivate(): Observable<boolean> {
    return this.afAuth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
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

  register(email: string, password: string, name: string, organization: string, isAdmin: boolean) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.SetUserData(result.user, name, organization, isAdmin);
        this.snackbar.open("Datos guardados exitosamente!", '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          window.alert("Este correo está asociado a una cuenta ya existente!");
        }
      });
  }

  /**
   * Método para activar una cuenta de usuario buscando por correo, y luego verificando la contraseña
   * @param correo 
   * @param pass 
   */
  activateAccount(correo: string, pass: string) {

    this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        if (correo == doc.data().correo) {
          if (doc.data().pass == pass) {
            var user = doc.data();

            this.registerWithSindicate(user.correo,user.pass,user.nombre,user.organization,user.isAdmin,user.idSindicato);

            if(user.organization == "Sindicato"){

              var usuario:UsuarioSindicato = {
                nombre:user.nombre,
                correo:user.correo,
                pass:user.pass,
                idSindicato:user.idSindicato
              }
              this.agregarUsuarioASindicato(user.idSindicato,usuario);
              //this.deleteInactiveUser(user.correo);

              //Buscar la id del usuario en inactivos para elminarlo de esa tabla
              this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {

      

                querySnapshot.forEach((doc) => {
          
                  if(doc.data().correo == correo){
          
                    this.idInactive = doc.data().id;
                    this.deleteInactiveUser(this.idInactive);
          
                  }
                });
              });
          

            }

          }
        }
      })

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

  SetUserData(user, name: string, organization: string, isAdmin: boolean) {

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      name: name,
      organization: organization,
      isAdmin: isAdmin
    };
    this.userID = user.uid;
    return userRef.set(userData, {
      merge: true,
    });
  }

  SetUserDataSindicato(user, name: string, organization: string, isAdmin: boolean, idSindicato: string) {

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `users/${user.uid}`
    );
    const userData: IUserSindicato = {
      uid: user.uid,
      email: user.email,
      name: name,
      organization: organization,
      isAdmin: isAdmin,
      idSindicato: idSindicato

    };
    this.userID = user.uid;
    return userRef.set(userData, {
      merge: true,
    });
  }

  isAdmin(userId: string): boolean {
    console.log('entró en el metodo isadmin de service')
    this.db.collection('users').doc(userId).get().subscribe((snapshotChanges) => {
      if (snapshotChanges.exists) {
        var doc = snapshotChanges.data();
        var isAdmin = doc.isAdmin;
        console.log('es admin en el service?: ', isAdmin)
        if (isAdmin == true) {
          return true;
        }
        else if (isAdmin == false) {
          return false;
        }
      }
    })


    return true;
  }


  registerWithSindicate(email: string, password: string, name: string, organization: string, isAdmin: boolean, idSindicato: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.SetUserDataSindicato(result.user, name, organization, isAdmin, idSindicato);
        this.snackbar.open("Datos guardados exitosamente!", '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });

      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          window.alert("Este correo está asociado a una cuenta ya existente!");
        }
      });
  }

  /**
   * En este método se agrega un usario con una cuenta inactiva esperando por su activación
   * @param nombre 
   * @param correo 
   * @param pass 
   * @param adminId 
   */
  addNewInactiveUser(nombre: string, correo: string, pass: string, adminId: string) {
    var uuid = require("uuid");
    var id = uuid.v4();

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `InactiveUsers/${id}`
    );

    var user = {
      nombre: nombre,
      correo: correo,
      pass: pass,
      idSindicato: adminId,
      organization: "Sindicato",
      isAdmin: false,
      id:id
    }

    return userRef.set(user, {
      merge: true,
    });

  }

  agregarUsuarioASindicato(idSindicato:string,usuarioSindicato:UsuarioSindicato){
    

    const userRef: AngularFirestoreDocument<any> = this.db.doc( `Sindicato/${idSindicato}`)
    this.db.collection("Sindicato").doc(idSindicato).get().subscribe((snapshotChanges)=>{

      var usuarioSindicatoList:UsuarioSindicato[] = [];
      if(snapshotChanges.exists){
        var user = snapshotChanges.data();

        var usuario ={
          nombre:usuarioSindicato.nombre,
          correo:usuarioSindicato.correo,
          pass:usuarioSindicato.pass,
          idSindicato:usuarioSindicato.idSindicato
        }
        usuarioSindicatoList = snapshotChanges.data().usuarios;
        console.log("lista de usuarios antes de agregar: ",usuarioSindicatoList);
        usuarioSindicatoList.push(usuario);
        console.log("lista de usuarios despues de agregar: ",usuarioSindicatoList)
        var sindicato ={
          nombreSindicato:user.nombreSindicato,
          idAdmin:user.idAdmin,
          usuarios:usuarioSindicatoList
        }
       console.log("usuariiooooo: ",sindicato)
        return userRef.set(sindicato,{
          merge:true,
        })
      }
    })

  }
  deleteInactiveUser (idInactive:string){

    
   
    this.snackbar.open("Activación exitosa!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });
    return this.fireservices.collection("InactiveUsers").doc(idInactive).delete();

  }

}


