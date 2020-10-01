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
import { UsuarioFundacion } from '../shared/Interfaces/UsuarioFundacion';
import { InactiveUser } from '../shared/Interfaces/InactiveUser';
import { FundacionService } from './fundacion.service';

@Injectable()
export class AuthService implements CanActivate {
  public user: User;
  private eventAuthError = new BehaviorSubject<String>('');
  private userID: any;
  eventAuthError$ = this.eventAuthError.asObservable();
  userData: any;
  idInactive: string;
  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    public fireservices: AngularFirestore,
    private fundSvc: FundacionService
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
          console.log(userCredential.user.emailVerified)
          if (userCredential.user.emailVerified == true) {
            this.router.navigate(['/home']);
          }
          else {
            this.snackbar.open("No se ha activado esta cuenta, revise su correo para la activación", '', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
          }
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

  registerWithFundationAdmin(email: string, password: string, name: string, organization: string, isAdmin: boolean, nombreFundacion: string) {

    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.sendEmailVerification();
        this.SetUserData(result.user, name, organization, isAdmin);
        var adminFundacion = {
          nombre: name,
          correo: email,
          pass: password,
          idFundacion: result.user.uid
        }
        console.log("Hola")
        //this.fundSvc.crearFundacion(nombreFundacion,result.user,adminFundacion);
        this.snackbar.open("Se ha enviado un correo de verificación para la cuenta registrada", '', {
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


  register(email: string, password: string, name: string, organization: string, isAdmin: boolean) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.sendEmailVerification();
        this.SetUserData(result.user, name, organization, isAdmin);
        this.snackbar.open("Se ha enviado un correo de verificación para la cuenta registrada", '', {
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

  async sendEmailVerification() {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  /**
   * Método para activar una cuenta del tipo fundacion de abogados, usando el email y luego verificando la contraseña, luego se manda
   * el enlace al correo para la otra activación.
   * @param correo 
   * @param pass 
   */
  activateFundacionAccount(correo: string, pass: string) {

    this.db.collection("InactiveUsersFundacion").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (correo == doc.data().correo) {
          if (doc.data().pass == pass) {
            var user = doc.data();
            var usuarioF: UsuarioFundacion = {
              nombre: user.nombre,
              correo: user.correo,
              idFundacion: user.idFundacion,
              pass: user.pass
            }
            this.registerWithSindicate(user.correo, user.pass, user.nombre, user.organization, user.isAdmin, user.idSindicato);
            this.agregarUsuarioAFundacion(user.idSindicato, usuarioF);
            //this.deleteInactiveUser(user.correo);

            //Buscar la id del usuario en inactivos para elminarlo de esa tabla
            this.db.collection("InactiveUsersFundacion").get().subscribe((querySnapshot) => {



              querySnapshot.forEach((doc) => {

                if (doc.data().correo == correo) {

                  this.idInactive = doc.data().id;
                  this.deleteInactiveUser(this.idInactive);

                }
              });
            });

          }
        }
      })
    })

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



            if (user.organization == "Sindicato") {
              this.registerWithSindicate(user.correo, user.pass, user.nombre, user.organization, user.isAdmin, user.idOrg);
              var usuario: UsuarioSindicato = {
                nombre: user.nombre,
                correo: user.correo,
                pass: user.pass,
                idSindicato: user.idOrg
              }
              this.agregarUsuarioASindicato(user.idOrg, usuario);
              //this.deleteInactiveUser(user.correo);

              //Buscar la id del usuario en inactivos para elminarlo de esa tabla
              this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {



                querySnapshot.forEach((doc) => {

                  if (doc.data().correo == correo) {

                    this.idInactive = doc.data().id;
                    this.deleteInactiveUser(this.idInactive);

                  }
                });
              });


            }
            if (user.organization == "Fundación") {
              this.registerWithSindicate(user.correo, user.pass, user.nombre, user.organization, user.isAdmin, user.idOrg);
              var usuarioFund: UsuarioFundacion = {
                nombre: user.nombre,
                correo: user.correo,
                pass: user.pass,
                idFundacion: user.idOrg
              }
              this.agregarUsuarioAFundacion(user.idOrg, usuarioFund);
              //this.deleteInactiveUser(user.correo);

              //Buscar la id del usuario en inactivos para elminarlo de esa tabla
              this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {



                querySnapshot.forEach((doc) => {

                  if (doc.data().correo == correo) {

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

  agregarUsuarioAFundacion(idFundacion: string, usuarioFundacion: any) {

    const userRef: AngularFirestoreDocument<any> = this.db.doc(`Fundacion/${idFundacion}`)
    this.db.collection("Fundacion").doc(idFundacion).get().subscribe((snapshotChanges) => {

      var usuarioFundacionList: UsuarioSindicato[] = [];
      if (snapshotChanges.exists) {
        console.log("Existe fundacion!!")
        var user = snapshotChanges.data();
        console.log("var user= ", user);
        var usuario = {
          nombre: usuarioFundacion.nombre,
          correo: usuarioFundacion.correo,
          pass: usuarioFundacion.pass,
          idSindicato: usuarioFundacion.idSindicato
        }
        console.log("var usuario = ", usuario);
        usuarioFundacionList = snapshotChanges.data().usuarios;
        console.log("lista de usuarios antes de agregar: ", usuarioFundacionList);
        usuarioFundacionList.push(usuario);
        console.log("lista de usuarios despues de agregar: ", usuarioFundacionList)
        var fundacion = {
          nombreFundacion: user.nombreFundacion,
          idAdmin: user.idAdmin,
          usuarios: usuarioFundacionList
        }
        console.log("var fundacion", fundacion)
        return userRef.set(fundacion, {
          merge: true,
        })
      }
    })

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


  /**
   * Método para poder registrar un usuario que pertenece a un sindicato al sistema
   * @param email 
   * @param password 
   * @param name 
   * @param organization 
   * @param isAdmin 
   * @param idSindicato 
   */
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
   * Método para poder registrar un usuario que pertenece a una fundacion al sistema.
   * @param email 
   * @param password 
   * @param name 
   * @param organization 
   * @param isAdmin 
   * @param idFundacion 
   */
  registerWithFundacion(email: string, password: string, name: string, organization: string, isAdmin: boolean, idFundacion: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
    up and returns promise */

        this.SetUserDataSindicato(result.user, name, organization, isAdmin, idFundacion);
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
  addNewInactiveUser(nombre: string, correo: string, pass: string, adminId: string,org:string) {
    var uuid = require("uuid");
    var id = uuid.v4();

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `InactiveUsers/${id}`
    );

    var user = {
      nombre: nombre,
      correo: correo,
      pass: pass,
      idOrg: adminId,
      organization: org,
      isAdmin: false,
      id: id
    }

    return userRef.set(user, {
      merge: true,
    });

  }

  addNewInactiveUserFundacion(nombre: string, correo: string, pass: string, adminId: string) {
    var uuid = require("uuid");
    var id = uuid.v4();

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `InactiveUsersFundacion/${id}`
    );

    var user = {
      nombre: nombre,
      correo: correo,
      pass: pass,
      idFundacion: adminId,
      organization: "Fundación",
      isAdmin: false,
      id: id
    }

    return userRef.set(user, {
      merge: true,
    });

  }

  addInactiveAdmin(nombre: string, correo: string, pass: string, idFundacion: any) {
    var uuid = require("uuid");
    var id = uuid.v4();

    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `InactiveUsersFundacion/${id}`
    );

    var user = {
      nombre: nombre,
      correo: correo,
      pass: pass,
      organization: "Fundación",
      idFundacion: idFundacion,
      isAdmin: true,
      id: id
    }

    return userRef.set(user, {
      merge: true,
    });
  }

  agregarUsuarioASindicato(idSindicato: string, usuarioSindicato: UsuarioSindicato) {


    const userRef: AngularFirestoreDocument<any> = this.db.doc(`Sindicato/${idSindicato}`)
    this.db.collection("Sindicato").doc(idSindicato).get().subscribe((snapshotChanges) => {

      var usuarioSindicatoList: UsuarioSindicato[] = [];
      if (snapshotChanges.exists) {
        console.log("Existe sindicato!!")
        var user = snapshotChanges.data();
        console.log("var user= ", user);
        var usuario = {
          nombre: usuarioSindicato.nombre,
          correo: usuarioSindicato.correo,
          pass: usuarioSindicato.pass,
          idSindicato: usuarioSindicato.idSindicato
        }
        console.log("var usuario = ", usuario);
        usuarioSindicatoList = snapshotChanges.data().usuarios;
        console.log("lista de usuarios antes de agregar: ", usuarioSindicatoList);
        usuarioSindicatoList.push(usuario);
        console.log("lista de usuarios despues de agregar: ", usuarioSindicatoList)
        var sindicato = {
          nombreSindicato: user.nombreSindicato,
          idAdmin: user.idAdmin,
          usuarios: usuarioSindicatoList
        }
        console.log("var sindicato", sindicato)
        return userRef.set(sindicato, {
          merge: true,
        })
      }
    })

  }


  deleteInactiveUser(idInactive: string) {



    this.snackbar.open("Activación exitosa!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return this.fireservices.collection("InactiveUsers").doc(idInactive).delete();

  }

}


