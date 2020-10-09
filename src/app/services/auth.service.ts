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
import { disableCursor } from '@fullcalendar/core';

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


            this.db.collection("users").get().subscribe((querySnapshot) => {
              querySnapshot.forEach((doc) => {

                if (doc.data().email == email) {

                  console.log("tipo de org: ", doc.data().organization)
                  if (doc.data().organization == "Sindicato") {

                    this.router.navigate(['/home']);

                  }
                  else {
                    if(doc.data().isAdmin == false){
                      this.router.navigate(['/home/estado-financiero-fundacion']);

                    }
                    else{
                      this.router.navigate(['/home/fundacion']);

                    }
                    //this.router.navigate(['/home/sindicato-fundacion/']);
                  }

                }

              });
            });





          }
          else {
            this.snackbar.open("No se ha activado esta cuenta, revise su correo para la activación", '', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
          }
        }
      });

   
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

        setTimeout(() => {
          this.sendEmailVerification();

        }, 1000)

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
    console.log("verificando correo:", this.afAuth.currentUser)
    return (await this.afAuth.currentUser).sendEmailVerification();
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

    var userData;

    if (user.organization == "Fundación") {
      userData = {
        uid: user.uid,
        email: user.email,
        name: name,
        organization: organization,
        isAdmin: isAdmin,
        idFundacion: idSindicato

      };
    }
    if (user.organization == "Sindicato") {

      userData = {
        uid: user.uid,
        email: user.email,
        name: name,
        organization: organization,
        isAdmin: isAdmin,
        idSindicato: idSindicato

      };
    }

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
  addNewInactiveUser(nombre: string, correo: string, pass: string, adminId: string, org: string) {
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

 


  deleteInactiveUser(idInactive: string) {



    this.snackbar.open("Activación exitosa!", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
    return this.fireservices.collection("InactiveUsers").doc(idInactive).delete();

  }



  activation(correo: string, pass: string) {

    this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        if (correo == doc.data().correo) {
          if (doc.data().pass == pass) {
            var user = doc.data();

            this.memberRegistration(user.correo, user.pass, user.nombre, user.organization, false, user.idOrg)

            var member: any = {
              nombre: user.nombre,
              correo: user.correo,
              pass: user.pass,
              idOrg: user.idOrg
            }

            setTimeout(() => {
              if (user.organization == "Sindicato") {

                this.addMemberToOrg(member.idOrg, member, "Sindicato")

              }
              if (user.organization == "Fundación") {

                this.addMemberToOrg(member.idOrg, member, "Fundación");
              }
            }, 1000)


            //Eliminar de inactivos
            setTimeout(() => {
              console.log("A eliminar del inactive")
              this.db.collection("InactiveUsers").get().subscribe((querySnapshot) => {

                querySnapshot.forEach((doc) => {

                  if (doc.data().correo == correo) {

                    this.idInactive = doc.data().id;
                    this.deleteInactiveUser(this.idInactive);

                  }
                });
              });
            }, 1000)



          }

        }

      })
    })

  }

  memberRegistration(correo: string, pass: string, nombre: string, organization: string, isAdmin: boolean, idOrg: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(correo, pass)
      .then((result) => {
        this.sendEmailVerification();
        this.setMember(result.user, nombre, organization, false, idOrg);
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

  setMember(user: any, nombre: string, organization: string, isAdmin: boolean, idOrg: string) {

    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    this.userID = user.uid;
    //var memberData;

    if (organization == "Sindicato") {
      var memberData = {
        uid: user.uid,
        email: user.email,
        name: nombre,
        organization: organization,
        isAdmin: isAdmin,
        idOrg: idOrg
      }

      return userRef.set(memberData, { merge: true });
    }
    if (organization == "Fundación") {
      var memberData = {
        uid: user.uid,
        email: user.email,
        name: nombre,
        organization: organization,
        isAdmin: isAdmin,
        idOrg: idOrg
      }
      return userRef.set(memberData, { merge: true })
    }

  }


  addMemberToOrg(idOrg: string, memberOrg: any, org: string) {
    console.log("Tipo de organizacion: ", org)
    if(org == "Fundación")
    {
      org = "Fundacion";
    }

    const userRef: AngularFirestoreDocument<any> = this.db.doc(`${org}/${idOrg}`);
    console.log("user REf: ", userRef.collection.name)
    this.db.collection(org).doc(idOrg).get().subscribe((snapshotChanges) => {
      console.log("Id org: ", idOrg);
      var memberList: any[] = [];
      if (snapshotChanges.exists) {
        var memberDoc = snapshotChanges.data();
        var member = {
          nombre: memberOrg.nombre,
          correo: memberOrg.correo,
          pass: memberOrg.pass,
          idOrg: memberOrg.idOrg
        }

        memberList = memberDoc.usuarios;
        memberList.push(member);

        if (org == "Sindicato") {

          var sindicato = {
            nombreSindicato: memberDoc.nombreSindicato,
            idAdmin: memberDoc.idAdmin,
            usuarios: memberDoc.usuarios
          }
           return userRef.set(sindicato, { merge: true,
           });
        }

        if (org == "Fundacion") {
          console.log("Es fundación")

          var fundacion = {
            nombreFundacion: memberDoc.nombreFundacion,
            idAdmin: memberDoc.idAdmin,
            usuarios: memberDoc.usuarios
          }
          console.log("Fundación: ", fundacion)
          this.snackbar.open("Usuario agregado con éxito a la fundación", '', {
            duration: 3000,
            verticalPosition: 'bottom'
          });
          return userRef.set(fundacion, {
            merge: true,
          });

        }

      }

    })
  }

  addMemberToFoundation(idOrg: string, member: any) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`Fundacion/${idOrg}`);
    this.db.collection("Fundacion").doc(idOrg).get().subscribe((snapshotChanges) => {

      var memberList: any[] = [];
      if (snapshotChanges.exists) {
        var memberDoc = snapshotChanges.data();
        var member = {
          nombre: member.nombre,
          correo: member.correo,
          pass: member.pass,
          idOrg: member.idOrg
        }
      }

    })
  }

}


